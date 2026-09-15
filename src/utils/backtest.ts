import type { Draw } from "@utils/history";
import { FIXED_PRIZES, GAMES_PER_SET } from "@utils/pricing";
import type { Wheel } from "@utils/wheel";

export type BacktestHit = {
  contest: number;
  date: string;
  drawn: number[];
  best: number;
  bestSet: number;
  bestGame: number[];
  prize: number;
  breakdown: { points: number; games: number }[];
};

export type Backtest = {
  contests: number;
  games: number;
  distribution: Map<number, number>;
  prizeContests: number;
  fixedPrizeTotal: number;
  best: BacktestHit[];
};

const PRIZE_FLOOR = 11;

export function runBacktest(wheels: Wheel[], draws: Draw[]): Backtest {
  const prepared = wheels.map((wheel) => ({
    wheel,
    poolSet: new Set(wheel.pool),
    outsideSet: new Set(wheel.outside),
  }));
  const distribution = new Map<number, number>();
  const hits: BacktestHit[] = [];
  let prizeContests = 0;
  let fixedPrizeTotal = 0;

  for (const draw of draws) {
    const merged = new Map<number, number>();
    let best = 0;
    let bestSet = 1;
    let bestGame: number[] = [];

    for (const { wheel, poolSet, outsideSet } of prepared) {
      let poolHits = 0;
      let outsideHits = 0;
      for (const value of draw.numbers) {
        if (poolSet.has(value)) poolHits++;
        else if (outsideSet.has(value)) outsideHits++;
      }
      const entries = [
        { points: poolHits + 1, games: outsideHits },
        { points: poolHits, games: GAMES_PER_SET - outsideHits },
      ].filter((entry) => entry.games > 0);

      for (const entry of entries) {
        merged.set(entry.points, (merged.get(entry.points) ?? 0) + entry.games);
        distribution.set(entry.points, (distribution.get(entry.points) ?? 0) + entry.games);
        fixedPrizeTotal += (FIXED_PRIZES[entry.points] ?? 0) * entry.games;
      }

      const wheelBest = Math.max(...entries.map((entry) => entry.points));
      if (wheelBest > best) {
        best = wheelBest;
        bestSet = wheel.set;
        const winner = wheel.games.find(
          (game) => game.numbers.filter((value) => draw.numbers.includes(value)).length === wheelBest
        );
        bestGame = winner ? winner.numbers : [];
      }
    }

    const breakdown = [...merged.entries()]
      .map(([points, games]) => ({ points, games }))
      .sort((a, b) => b.points - a.points);

    if (best < PRIZE_FLOOR) continue;
    prizeContests++;
    hits.push({
      contest: draw.contest,
      date: draw.date,
      drawn: draw.numbers,
      best,
      bestSet,
      bestGame,
      prize: breakdown.reduce((acc, e) => acc + (FIXED_PRIZES[e.points] ?? 0) * e.games, 0),
      breakdown,
    });
  }

  hits.sort((a, b) => b.best - a.best || b.prize - a.prize || b.contest - a.contest);
  return {
    contests: draws.length,
    games: wheels.length * GAMES_PER_SET,
    distribution,
    prizeContests,
    fixedPrizeTotal,
    best: hits,
  };
}
