import { CheckIcon } from "@phosphor-icons/react";
import { GAMES_PER_SET } from "@utils/pricing";
import type { Bands } from "@utils/stats";
import type { Wheel as WheelModel } from "@utils/wheel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@widgets/Tabs";
import { Wheel } from "@widgets/Wheel";

type WheelsProps = {
  wheels: WheelModel[];
  bands: Bands;
  previous?: number[];
  spinning?: boolean;
  active: number;
  onActiveChange: (set: number) => void;
  playedCount: (set: number) => number;
  isPlayed: (set: number, gameIndex: number) => boolean;
  onToggle: (set: number, gameIndex: number) => void;
  onClear: (set: number) => void;
};

export function Wheels({
  wheels,
  bands,
  previous,
  spinning = false,
  active,
  onActiveChange,
  playedCount,
  isPlayed,
  onToggle,
  onClear,
}: WheelsProps) {
  if (wheels.length === 0) return null;

  const wheelProps = (wheel: WheelModel) => ({
    wheel,
    bands,
    previous,
    spinning,
    playedCount: playedCount(wheel.set),
    isPlayed: (gameIndex: number) => isPlayed(wheel.set, gameIndex),
    onToggle: (gameIndex: number) => onToggle(wheel.set, gameIndex),
    onClear: () => onClear(wheel.set),
  });

  if (wheels.length === 1) {
    return <Wheel {...wheelProps(wheels[0])} showLabel={false} />;
  }

  return (
    <Tabs
      id="wheels"
      value={active}
      onValueChange={(value) => onActiveChange(Number(value))}
      className="gap-6"
    >
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList aria-label="Suas sequências da sorte">
          {wheels.map((wheel) => {
            const done = playedCount(wheel.set);
            const complete = done === GAMES_PER_SET;
            return (
              <TabsTrigger key={wheel.set} value={wheel.set} id={`wheel-tab-${wheel.set}`}>
                {complete ? <CheckIcon weight="bold" className="size-3.5" /> : null}
                Sorte {wheel.set}
                {done > 0 && !complete ? (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {done}/{GAMES_PER_SET}
                  </span>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {wheels.map((wheel) => (
        <TabsContent key={wheel.set} value={wheel.set}>
          <Wheel {...wheelProps(wheel)} showLabel={false} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
