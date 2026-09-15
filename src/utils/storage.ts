import { randomSeed } from "@utils/random";

const KEY = "mylucky:draft";

export type Draft = {
  seed: number;
  sets: number;
  played: string[];
};

export function newDraft(sets = 1): Draft {
  return { seed: randomSeed(), sets, played: [] };
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (typeof parsed.seed !== "number" || typeof parsed.sets !== "number") return null;
    return {
      seed: parsed.seed,
      sets: parsed.sets,
      played: Array.isArray(parsed.played) ? parsed.played.filter((k) => typeof k === "string") : [],
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // modo privativo ou storage cheio: as marcações valem só para esta sessão
  }
}

export function playedKey(set: number, gameIndex: number): string {
  return `${set}:${gameIndex}`;
}
