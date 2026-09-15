import type { Draw } from "@utils/history";
import type { Wheel } from "@utils/wheel";

export type BacktestHit = {
  contest: number;
  date: string;
  poolHits: number;
  best: number;
  breakdown: { points: number; games: number }[];
};

export type Backtest = {
  contests: number;
  distribution: Map<number, number>;
  prizeContests: number;
  best: BacktestHit[];
};

const PRIZE_FLOOR = 11;

export function runBacktest(wheel: Wheel, draws: Draw[], topSize = 8): Backtest {
  const poolSet = new Set(wheel.pool);
  const outsideSet = new Set(wheel.outside);
  const distribution = new Map<number, number>();
  const hits: BacktestHit[] = [];
  let prizeContests = 0;

  for (const draw of draws) {
    let poolHits = 0;
    let outsideHits = 0;
    for (const value of draw.numbers) {
      if (poolSet.has(value)) poolHits++;
      else if (outsideSet.has(value)) outsideHits++;
    }
    const breakdown = [
      { points: poolHits + 1, games: outsideHits },
      { points: poolHits, games: 11 - outsideHits },
    ].filter((entry) => entry.games > 0);

    for (const entry of breakdown) {
      distribution.set(entry.points, (distribution.get(entry.points) ?? 0) + entry.games);
    }

    const best = Math.max(...breakdown.map((entry) => entry.points));
    if (best >= PRIZE_FLOOR) prizeContests++;
    hits.push({ contest: draw.contest, date: draw.date, poolHits, best, breakdown });
  }

  hits.sort((a, b) => b.best - a.best || b.poolHits - a.poolHits || b.contest - a.contest);
  return { contests: draws.length, distribution, prizeContests, best: hits.slice(0, topSize) };
}
