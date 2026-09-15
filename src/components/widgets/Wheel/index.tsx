import { Badge } from "@elements/Badge";
import { Ball } from "@elements/Ball";
import { Button } from "@elements/Button";
import { useShuffleReveal } from "@hooks/Reveal";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { GAMES_PER_SET } from "@utils/pricing";
import { type Bands, computeFeatures, FEATURE_LABELS, type FeatureKey } from "@utils/stats";
import type { Wheel as WheelModel } from "@utils/wheel";
import { GameList } from "@widgets/Game";
import { Shuffling } from "@widgets/Shuffling";

const SHOWN: FeatureKey[] = ["even", "sum", "primes", "frame", "repeats"];

type WheelProps = {
  wheel: WheelModel;
  bands: Bands;
  previous?: number[];
  showLabel: boolean;
  spinning?: boolean;
  playedCount: number;
  isPlayed: (gameIndex: number) => boolean;
  onToggle: (gameIndex: number) => void;
  onClear: () => void;
};

export function Wheel({
  wheel,
  bands,
  previous,
  showLabel,
  spinning = false,
  playedCount,
  isPlayed,
  onToggle,
  onClear,
}: WheelProps) {
  const features = computeFeatures(wheel.pool, previous);
  const { display, isSettled } = useShuffleReveal(wheel.pool, spinning);
  const complete = playedCount === GAMES_PER_SET;

  return (
    <section id={`wheel-${wheel.set}`} className="flex flex-col gap-4">
      {showLabel ? (
        <h3 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
          Sorte {wheel.set}
        </h3>
      ) : null}

      <ul className="flex flex-wrap gap-2">
        {display.map((value, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a identidade de cada bola e o slot, nao o valor sorteado
          <li key={`${wheel.set}-slot-${index}`}>
            <Ball
              value={value}
              tone="pool"
              spinning={spinning && !isSettled(index)}
              justSettled={spinning && isSettled(index)}
            />
          </li>
        ))}
      </ul>

      {spinning ? <Shuffling /> : null}

      <div aria-hidden={spinning} hidden={spinning} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {SHOWN.map((key) => (
            <Badge key={key} variant="outline" className="font-mono">
              {FEATURE_LABELS[key]} {features[key]}
              <span className="text-muted-foreground">
                /{bands[key].min}–{bands[key].max}
              </span>
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-2.5">
          <span className="flex items-center gap-2 text-sm">
            {complete ? <CheckCircleIcon weight="fill" className="size-4" /> : null}
            <span className={complete ? "font-heading" : "text-muted-foreground"}>
              {complete ? (
                "Todos os jogos desta sequência já foram feitos"
              ) : (
                <>
                  <span className="text-foreground tabular-nums">{playedCount}</span> de {GAMES_PER_SET} jogos
                  feitos — toque num jogo ao apostar
                </>
              )}
            </span>
          </span>
          {playedCount > 0 ? (
            <Button id={`clear-played-${wheel.set}`} variant="ghost" size="sm" onClick={onClear}>
              Desmarcar todos
            </Button>
          ) : null}
        </div>

        <GameList games={wheel.games} isPlayed={isPlayed} onToggle={onToggle} />
      </div>
    </section>
  );
}
