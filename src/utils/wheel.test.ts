import { readFileSync } from "node:fs";
import { runBacktest } from "@utils/backtest";
import { generatePool } from "@utils/generator";
import { DRAW_SIZE, type History, POOL_SIZE, toDraws } from "@utils/history";
import { costOf, GAMES_PER_SET, TICKET_PRICE } from "@utils/pricing";
import { createRng, sample } from "@utils/random";
import { computeFeatures, derivePoolBands, withinBands } from "@utils/stats";
import { buildWheel, buildWheels, gameKey, guaranteeTable, resolveActiveSet, scoreWheel } from "@utils/wheel";
import { describe, expect, it } from "vitest";

const history: History = JSON.parse(readFileSync("public/data/history.json", "utf8"));
const draws = toDraws(history);
const universe = Array.from({ length: 25 }, (_, i) => i + 1);
const bands = derivePoolBands(history.draws, POOL_SIZE, 0.97);
const previous = history.draws.at(-1) as number[];

describe("buildWheel", () => {
  it("gera 11 jogos de 15 dezenas cobrindo todas as dezenas de fora", () => {
    const wheel = buildWheel(universe.slice(0, POOL_SIZE));
    expect(wheel.games).toHaveLength(GAMES_PER_SET);
    expect(wheel.outside).toHaveLength(GAMES_PER_SET);
    for (const game of wheel.games) {
      expect(game.numbers).toHaveLength(DRAW_SIZE);
      expect(new Set(game.numbers).size).toBe(DRAW_SIZE);
    }
    expect(new Set(wheel.games.map((g) => g.extra))).toEqual(new Set(wheel.outside));
  });

  it("rejeita pool com tamanho errado", () => {
    expect(() => buildWheel([1, 2, 3])).toThrow();
  });
});

describe("garantia deterministica", () => {
  it("o resultado real dos 11 jogos bate com a tabela de garantia em todos os sorteios historicos", () => {
    const rng = createRng(20260915);
    const table = new Map(guaranteeTable().map((row) => [row.poolHits, row]));
    let checked = 0;

    for (let trial = 0; trial < 40; trial++) {
      const wheel = buildWheel(sample(universe, POOL_SIZE, rng));
      const poolSet = new Set(wheel.pool);

      for (const draw of draws) {
        const poolHits = draw.numbers.filter((n) => poolSet.has(n)).length;
        const scored = scoreWheel(wheel, draw.numbers);
        expect(scored.reduce((acc, e) => acc + e.games, 0)).toBe(GAMES_PER_SET);

        for (const entry of scored) {
          const brute = wheel.games.filter(
            (game) => game.numbers.filter((n) => draw.numbers.includes(n)).length === entry.points
          ).length;
          expect(brute).toBe(entry.games);
        }

        const expected = table.get(poolHits);
        if (expected) {
          expect(scored.find((e) => e.points === expected.high.points)?.games ?? 0).toBe(expected.high.games);
          expect(scored.find((e) => e.points === expected.low.points)?.games ?? 0).toBe(expected.low.games);
        }
        checked++;
      }
    }
    expect(checked).toBe(40 * draws.length);
  });
});

describe("buildWheels", () => {
  it("gera a quantidade pedida de conjuntos", () => {
    for (const sets of [1, 2, 5, 10]) {
      expect(buildWheels(sets, bands, previous, 1234)).toHaveLength(sets);
    }
  });

  it("nunca repete um jogo entre conjuntos", () => {
    for (let seed = 1; seed <= 25; seed++) {
      const wheels = buildWheels(10, bands, previous, seed);
      const keys = wheels.flatMap((wheel) => wheel.games.map((game) => gameKey(game.numbers)));
      expect(keys).toHaveLength(10 * GAMES_PER_SET);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("numera os conjuntos em sequencia e respeita as faixas", () => {
    const wheels = buildWheels(4, bands, previous, 99);
    expect(wheels.map((w) => w.set)).toEqual([1, 2, 3, 4]);
    for (const wheel of wheels) {
      expect(withinBands(computeFeatures(wheel.pool, previous), bands)).toBe(true);
    }
  });
});

describe("runBacktest", () => {
  it("distribui exatamente 11 jogos por concurso por conjunto", () => {
    for (const sets of [1, 3]) {
      const wheels = buildWheels(sets, bands, previous, 7);
      const result = runBacktest(wheels, draws);
      const total = [...result.distribution.values()].reduce((a, b) => a + b, 0);
      expect(result.contests).toBe(draws.length);
      expect(result.games).toBe(sets * GAMES_PER_SET);
      expect(total).toBe(draws.length * sets * GAMES_PER_SET);
    }
  });

  it("ordena os melhores resultados e guarda os dados da comparacao", () => {
    const result = runBacktest(buildWheels(2, bands, previous, 7), draws);
    const bests = result.best.map((hit) => hit.best);
    expect(bests).toEqual([...bests].sort((a, b) => b - a));
    for (const hit of result.best) {
      expect(hit.drawn).toHaveLength(DRAW_SIZE);
      expect(hit.bestGame).toHaveLength(DRAW_SIZE);
      const matched = hit.bestGame.filter((n) => hit.drawn.includes(n)).length;
      expect(matched).toBe(hit.best);
    }
  });
});

describe("pricing", () => {
  it("calcula o custo como conjuntos x 11 jogos x preco da aposta", () => {
    expect(TICKET_PRICE).toBe(3.5);
    expect(costOf(1)).toBeCloseTo(38.5, 2);
    expect(costOf(2)).toBeCloseTo(77, 2);
    expect(costOf(10)).toBeCloseTo(385, 2);
  });
});

describe("generatePool", () => {
  it("produz 14 dezenas unicas dentro das faixas, sem relaxar", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const { pool, relaxed } = generatePool(bands, previous, seed);
      expect(pool).toHaveLength(POOL_SIZE);
      expect(new Set(pool).size).toBe(POOL_SIZE);
      expect(relaxed).toEqual([]);
      expect(withinBands(computeFeatures(pool, previous), bands)).toBe(true);
    }
  });

  it("e deterministico para a mesma seed", () => {
    expect(generatePool(bands, previous, 42).pool).toEqual(generatePool(bands, previous, 42).pool);
  });
});

describe("resolveActiveSet", () => {
  const wheels = buildWheels(3, bands, previous, 5);

  it("mantem o conjunto ativo quando ele ainda existe", () => {
    expect(resolveActiveSet(wheels, 2)).toBe(2);
    expect(resolveActiveSet(wheels, 3)).toBe(3);
  });

  it("volta para o primeiro quando o conjunto ativo deixou de existir", () => {
    expect(resolveActiveSet(wheels, 10)).toBe(1);
    expect(resolveActiveSet(wheels.slice(0, 1), 3)).toBe(1);
  });

  it("nao quebra com lista vazia", () => {
    expect(resolveActiveSet([], 7)).toBe(1);
  });
});
