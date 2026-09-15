import { readFileSync } from "node:fs";
import { runBacktest } from "@utils/backtest";
import { generatePool } from "@utils/generator";
import { DRAW_SIZE, type History, POOL_SIZE, toDraws } from "@utils/history";
import { createRng, sample } from "@utils/random";
import { computeFeatures, derivePoolBands, withinBands } from "@utils/stats";
import { buildWheel, guaranteeTable, scoreWheel } from "@utils/wheel";
import { describe, expect, it } from "vitest";

const history: History = JSON.parse(readFileSync("public/data/history.json", "utf8"));
const draws = toDraws(history);
const universe = Array.from({ length: 25 }, (_, i) => i + 1);

describe("buildWheel", () => {
  it("gera 11 jogos de 15 dezenas cobrindo todas as dezenas de fora", () => {
    const wheel = buildWheel(universe.slice(0, POOL_SIZE));
    expect(wheel.games).toHaveLength(11);
    expect(wheel.outside).toHaveLength(11);
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
        const totalGames = scored.reduce((acc, e) => acc + e.games, 0);
        expect(totalGames).toBe(11);

        for (const entry of scored) {
          const brute = wheel.games.filter(
            (game) => game.numbers.filter((n) => draw.numbers.includes(n)).length === entry.points
          ).length;
          expect(brute).toBe(entry.games);
        }

        const expected = table.get(poolHits);
        if (expected) {
          const high = scored.find((e) => e.points === expected.high.points)?.games ?? 0;
          const low = scored.find((e) => e.points === expected.low.points)?.games ?? 0;
          expect(high).toBe(expected.high.games);
          expect(low).toBe(expected.low.games);
        }
        checked++;
      }
    }
    expect(checked).toBe(40 * draws.length);
  });
});

describe("runBacktest", () => {
  it("distribui exatamente 11 jogos por concurso", () => {
    const wheel = buildWheel(sample(universe, POOL_SIZE, createRng(7)));
    const result = runBacktest(wheel, draws);
    const total = [...result.distribution.values()].reduce((a, b) => a + b, 0);
    expect(result.contests).toBe(draws.length);
    expect(total).toBe(draws.length * 11);
    const bests = result.best.map((hit) => hit.best);
    expect(bests).toEqual([...bests].sort((a, b) => b - a));
  });
});

describe("generatePool", () => {
  const bands = derivePoolBands(history.draws, POOL_SIZE, 0.97);

  it("deriva faixas a partir de subconjuntos de 14 dos sorteios reais", () => {
    expect(bands.even.min).toBeLessThan(bands.even.max);
    expect(bands.sum.min).toBeGreaterThan(100);
    expect(bands.sum.max).toBeLessThan(250);
  });

  it("produz 14 dezenas unicas dentro das faixas, sem relaxar", () => {
    const previous = history.draws.at(-1) as number[];
    for (let seed = 1; seed <= 200; seed++) {
      const { pool, relaxed } = generatePool(bands, previous, seed);
      expect(pool).toHaveLength(POOL_SIZE);
      expect(new Set(pool).size).toBe(POOL_SIZE);
      expect(pool.every((n) => n >= 1 && n <= 25)).toBe(true);
      expect(relaxed).toEqual([]);
      expect(withinBands(computeFeatures(pool, previous), bands)).toBe(true);
    }
  });

  it("e deterministico para a mesma seed", () => {
    const previous = history.draws.at(-1) as number[];
    expect(generatePool(bands, previous, 42).pool).toEqual(generatePool(bands, previous, 42).pool);
  });
});
