import { UNIVERSE } from "@utils/history";
import * as React from "react";

const TICK_MS = 60;
const START_DELAY_MS = 380;
const STEP_MS = 90;
const TAIL_MS = 260;

export function revealDuration(count: number): number {
  return START_DELAY_MS + count * STEP_MS + TAIL_MS;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = () => setReduced(query.matches);
    query.addEventListener("change", handle);
    return () => query.removeEventListener("change", handle);
  }, []);

  return reduced;
}

type Reveal = {
  display: number[];
  isSettled: (index: number) => boolean;
};

export function useShuffleReveal(target: number[], spinning: boolean): Reveal {
  const [elapsed, setElapsed] = React.useState(Number.POSITIVE_INFINITY);
  const [noise, setNoise] = React.useState<number[]>(target);

  React.useEffect(() => {
    if (!spinning) {
      setElapsed(Number.POSITIVE_INFINITY);
      return;
    }
    setElapsed(0);
    const started = performance.now();
    const id = window.setInterval(() => {
      setElapsed(performance.now() - started);
      setNoise(Array.from({ length: target.length }, () => 1 + Math.floor(Math.random() * UNIVERSE)));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [spinning, target.length]);

  const settledCount = Math.max(0, Math.floor((elapsed - START_DELAY_MS) / STEP_MS));
  return {
    display: target.map((value, index) => (index < settledCount ? value : (noise[index] ?? value))),
    isSettled: (index: number) => index < settledCount,
  };
}
