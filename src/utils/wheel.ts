import { DRAW_SIZE, POOL_SIZE } from "@utils/history";
import { allNumbers, type Bands, computeFeatures, withinBands } from "@utils/stats";

export type Game = {
  index: number;
  numbers: number[];
  extra: number;
};

export type Wheel = {
  pool: number[];
  outside: number[];
  games: Game[];
};

export type Guarantee = {
  poolHits: number;
  high: { points: number; games: number };
  low: { points: number; games: number };
};

export function buildWheel(pool: number[]): Wheel {
  if (pool.length !== POOL_SIZE) throw new Error(`O pool precisa ter ${POOL_SIZE} dezenas`);
  const inPool = new Set(pool);
  const outside = allNumbers().filter((value) => !inPool.has(value));
  const sorted = [...pool].sort((a, b) => a - b);
  return {
    pool: sorted,
    outside,
    games: outside.map((extra, index) => ({
      index: index + 1,
      extra,
      numbers: [...sorted, extra].sort((a, b) => a - b),
    })),
  };
}

export function guaranteeTable(): Guarantee[] {
  const table: Guarantee[] = [];
  for (let poolHits = POOL_SIZE; poolHits >= 10; poolHits--) {
    const outsideHits = DRAW_SIZE - poolHits;
    if (outsideHits < 0 || outsideHits > 11) continue;
    table.push({
      poolHits,
      high: { points: poolHits + 1, games: outsideHits },
      low: { points: poolHits, games: 11 - outsideHits },
    });
  }
  return table;
}

export function scoreWheel(wheel: Wheel, drawn: number[]): { points: number; games: number }[] {
  const drawnSet = new Set(drawn);
  const poolHits = wheel.pool.reduce((acc, value) => acc + (drawnSet.has(value) ? 1 : 0), 0);
  const outsideHits = wheel.outside.filter((value) => drawnSet.has(value)).length;
  const result = [
    { points: poolHits + 1, games: outsideHits },
    { points: poolHits, games: 11 - outsideHits },
  ].filter((entry) => entry.games > 0);
  return result;
}

export function poolPassesBands(pool: number[], bands: Bands, previous?: number[]): boolean {
  return withinBands(computeFeatures(pool, previous), bands);
}
