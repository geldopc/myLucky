import { generatePool } from "@utils/generator";
import { DRAW_SIZE, POOL_SIZE } from "@utils/history";
import { GAMES_PER_SET } from "@utils/pricing";
import { allNumbers, type Bands, computeFeatures, withinBands } from "@utils/stats";

export type Game = {
  index: number;
  numbers: number[];
  extra: number;
};

export type Wheel = {
  set: number;
  pool: number[];
  outside: number[];
  games: Game[];
};

export type Guarantee = {
  poolHits: number;
  high: { points: number; games: number };
  low: { points: number; games: number };
};

export function gameKey(numbers: number[]): string {
  return numbers.join("-");
}

export function buildWheel(pool: number[], set = 1): Wheel {
  if (pool.length !== POOL_SIZE) throw new Error(`O pool precisa ter ${POOL_SIZE} dezenas`);
  const inPool = new Set(pool);
  const outside = allNumbers().filter((value) => !inPool.has(value));
  const sorted = [...pool].sort((a, b) => a - b);
  return {
    set,
    pool: sorted,
    outside,
    games: outside.map((extra, index) => ({
      index: index + 1,
      extra,
      numbers: [...sorted, extra].sort((a, b) => a - b),
    })),
  };
}

export function buildWheels(
  sets: number,
  bands: Bands,
  previous: number[] | undefined,
  seed: number
): Wheel[] {
  const wheels: Wheel[] = [];
  const used = new Set<string>();
  let attempt = 0;

  while (wheels.length < sets && attempt < sets * 200) {
    const { pool } = generatePool(bands, previous, seed + attempt * 7919);
    attempt++;
    const wheel = buildWheel(pool, wheels.length + 1);
    const keys = wheel.games.map((game) => gameKey(game.numbers));
    if (keys.some((key) => used.has(key))) continue;
    for (const key of keys) used.add(key);
    wheels.push(wheel);
  }

  return wheels;
}

export function guaranteeTable(): Guarantee[] {
  const table: Guarantee[] = [];
  for (let poolHits = POOL_SIZE; poolHits >= 10; poolHits--) {
    const outsideHits = DRAW_SIZE - poolHits;
    if (outsideHits < 0 || outsideHits > GAMES_PER_SET) continue;
    table.push({
      poolHits,
      high: { points: poolHits + 1, games: outsideHits },
      low: { points: poolHits, games: GAMES_PER_SET - outsideHits },
    });
  }
  return table;
}

export function scoreWheel(wheel: Wheel, drawn: number[]): { points: number; games: number }[] {
  const drawnSet = new Set(drawn);
  const poolHits = wheel.pool.reduce((acc, value) => acc + (drawnSet.has(value) ? 1 : 0), 0);
  const outsideHits = wheel.outside.filter((value) => drawnSet.has(value)).length;
  return [
    { points: poolHits + 1, games: outsideHits },
    { points: poolHits, games: GAMES_PER_SET - outsideHits },
  ].filter((entry) => entry.games > 0);
}

export function poolPassesBands(pool: number[], bands: Bands, previous?: number[]): boolean {
  return withinBands(computeFeatures(pool, previous), bands);
}
