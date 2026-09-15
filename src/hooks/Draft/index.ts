import { randomSeed } from "@utils/random";
import { type Draft, loadDraft, newDraft, saveDraft } from "@utils/storage";
import * as React from "react";

export function useDraft(minSets: number, maxSets: number) {
  const [draft, setDraft] = React.useState<Draft>(() => {
    const stored = loadDraft();
    if (!stored) return newDraft();
    return { ...stored, sets: Math.min(maxSets, Math.max(minSets, stored.sets)) };
  });

  React.useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const played = React.useMemo(() => new Set(draft.played), [draft.played]);

  const setSets = React.useCallback((sets: number) => {
    setDraft((current) => ({ ...current, sets }));
  }, []);

  const redraw = React.useCallback(() => {
    setDraft((current) => ({ seed: randomSeed(), sets: current.sets, played: [] }));
  }, []);

  const togglePlayed = React.useCallback((key: string) => {
    setDraft((current) => ({
      ...current,
      played: current.played.includes(key)
        ? current.played.filter((entry) => entry !== key)
        : [...current.played, key],
    }));
  }, []);

  const clearSet = React.useCallback((set: number) => {
    const prefix = `${set}:`;
    setDraft((current) => ({
      ...current,
      played: current.played.filter((entry) => !entry.startsWith(prefix)),
    }));
  }, []);

  return { seed: draft.seed, sets: draft.sets, played, setSets, redraw, togglePlayed, clearSet };
}
