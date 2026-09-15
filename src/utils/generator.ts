import { POOL_SIZE } from "@utils/history";
import { createRng, type Rng, sample } from "@utils/random";
import { allNumbers, type Bands, computeFeatures, type FeatureKey, withinBands } from "@utils/stats";

export type PoolResult = {
  pool: number[];
  seed: number;
  attempts: number;
  relaxed: FeatureKey[];
};

const MAX_ATTEMPTS = 4000;

const RELAX_ORDER: FeatureKey[] = [
  "maxRun",
  "maxColumn",
  "maxRow",
  "primes",
  "frame",
  "repeats",
  "sum",
  "even",
];

export function generatePool(bands: Bands, previous: number[] | undefined, seed: number): PoolResult {
  const rng: Rng = createRng(seed);
  const universe = allNumbers();
  const relaxed: FeatureKey[] = [];
  let attempts = 0;

  for (let stage = 0; stage <= RELAX_ORDER.length; stage++) {
    const skip = RELAX_ORDER.slice(0, stage);
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      attempts++;
      const pool = sample(universe, POOL_SIZE, rng);
      if (withinBands(computeFeatures(pool, previous), bands, skip)) {
        return { pool, seed, attempts, relaxed: skip };
      }
    }
    relaxed.push(...RELAX_ORDER.slice(stage, stage + 1));
  }

  return { pool: sample(universe, POOL_SIZE, rng), seed, attempts, relaxed: RELAX_ORDER };
}
