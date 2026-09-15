import { UNIVERSE } from "@utils/history";

export const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23]);

export const FRAME = new Set([1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25]);

export const FEATURE_LABELS = {
  even: "Pares",
  sum: "Soma",
  primes: "Primos",
  frame: "Moldura",
  repeats: "Repetidos do anterior",
  maxRun: "Maior sequência",
  maxRow: "Máx. por linha",
  maxColumn: "Máx. por coluna",
} as const;

export type FeatureKey = keyof typeof FEATURE_LABELS;
export type Features = Record<FeatureKey, number>;
export type Band = { min: number; max: number };
export type Bands = Record<FeatureKey, Band>;

export function row(value: number): number {
  return Math.floor((value - 1) / 5);
}

export function column(value: number): number {
  return (value - 1) % 5;
}

function longestRun(sorted: number[]): number {
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    current = sorted[i] === sorted[i - 1] + 1 ? current + 1 : 1;
    if (current > best) best = current;
  }
  return best;
}

function maxBucket(numbers: number[], bucket: (value: number) => number): number {
  const counts = new Array(5).fill(0);
  for (const value of numbers) counts[bucket(value)]++;
  return Math.max(...counts);
}

export function computeFeatures(numbers: number[], previous?: number[]): Features {
  const sorted = [...numbers].sort((a, b) => a - b);
  const set = new Set(sorted);
  let even = 0;
  let sum = 0;
  let primes = 0;
  let frame = 0;
  for (const value of sorted) {
    if (value % 2 === 0) even++;
    sum += value;
    if (PRIMES.has(value)) primes++;
    if (FRAME.has(value)) frame++;
  }
  let repeats = 0;
  if (previous) for (const value of previous) if (set.has(value)) repeats++;
  return {
    even,
    sum,
    primes,
    frame,
    repeats,
    maxRun: longestRun(sorted),
    maxRow: maxBucket(sorted, row),
    maxColumn: maxBucket(sorted, column),
  };
}

export function withinBands(features: Features, bands: Bands, skip?: FeatureKey[]): boolean {
  for (const key of Object.keys(bands) as FeatureKey[]) {
    if (skip?.includes(key)) continue;
    const value = features[key];
    if (value < bands[key].min || value > bands[key].max) return false;
  }
  return true;
}

function narrowestBand(values: number[], coverage: number): Band {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const keys = [...counts.keys()].sort((a, b) => a - b);
  const needed = values.length * coverage;
  let best: Band | null = null;
  for (let start = 0; start < keys.length; start++) {
    let acc = 0;
    for (let end = start; end < keys.length; end++) {
      acc += counts.get(keys[end]) as number;
      if (acc >= needed) {
        const width = keys[end] - keys[start];
        if (!best || width < best.max - best.min) best = { min: keys[start], max: keys[end] };
        break;
      }
    }
  }
  return best ?? { min: Math.min(...values), max: Math.max(...values) };
}

export function derivePoolBands(draws: number[][], poolSize: number, coverage: number): Bands {
  const samples: Features[] = [];
  for (let i = 1; i < draws.length; i++) {
    const draw = draws[i];
    const previous = draws[i - 1];
    for (let drop = 0; drop < draw.length; drop++) {
      if (draw.length - 1 !== poolSize) break;
      samples.push(
        computeFeatures(
          draw.filter((_, index) => index !== drop),
          previous
        )
      );
    }
  }
  const keys = Object.keys(FEATURE_LABELS) as FeatureKey[];
  const bands = {} as Bands;
  for (const key of keys)
    bands[key] = narrowestBand(
      samples.map((s) => s[key]),
      coverage
    );
  return bands;
}

export function allNumbers(): number[] {
  return Array.from({ length: UNIVERSE }, (_, index) => index + 1);
}
