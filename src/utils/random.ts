export type Rng = () => number;

export function createRng(seed: number): Rng {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

export function randomSeed(): number {
  return (crypto.getRandomValues(new Uint32Array(1))[0] || 1) >>> 0;
}

export function sample(values: number[], size: number, rng: Rng): number[] {
  const pool = [...values];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size).sort((a, b) => a - b);
}
