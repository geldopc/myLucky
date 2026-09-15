import { Button } from "@elements/Button";
import { ArrowsClockwiseIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@utils/css";
import { formatMoney, GAMES_PER_SET } from "@utils/pricing";
import type { Wheel } from "@utils/wheel";

type DrawBarProps = {
  wheel: Wheel | undefined;
  totalSets: number;
  cost: number;
  visible: boolean;
  spinning: boolean;
  onDraw: () => void;
  playedCount: number;
  totalPlayed: number;
  onPrev: () => void;
  onNext: () => void;
};

export function DrawBar({
  wheel,
  totalSets,
  cost,
  visible,
  spinning,
  onDraw,
  playedCount,
  totalPlayed,
  onPrev,
  onNext,
}: DrawBarProps) {
  if (!wheel) return null;
  const multiple = totalSets > 1;

  return (
    <div
      id="draw-bar"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {multiple ? (
            <Button
              id="draw-bar-prev"
              variant="outline"
              size="icon"
              aria-label="Sequência anterior"
              onClick={onPrev}
              disabled={spinning}
              tabIndex={visible ? undefined : -1}
            >
              <CaretLeftIcon weight="bold" />
            </Button>
          ) : null}

          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {multiple ? `Sorte ${wheel.set} de ${totalSets}` : "Seus números da sorte"} ·{" "}
              <span className="text-foreground tabular-nums">{formatMoney(cost)}</span>
              {totalPlayed > 0 ? (
                <>
                  {" · "}
                  <span className="text-foreground tabular-nums">{multiple ? totalPlayed : playedCount}</span>{" "}
                  {multiple ? `de ${totalSets * GAMES_PER_SET} feitos` : `de ${GAMES_PER_SET} feitos`}
                </>
              ) : null}
            </span>
            <ul className="flex flex-wrap gap-1">
              {wheel.pool.map((value) => (
                <li key={value}>
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground font-mono text-[11px] text-background tabular-nums">
                    {String(value).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {multiple ? (
            <Button
              id="draw-bar-next"
              variant="outline"
              size="icon"
              aria-label="Próxima sequência"
              onClick={onNext}
              disabled={spinning}
              tabIndex={visible ? undefined : -1}
            >
              <CaretRightIcon weight="bold" />
            </Button>
          ) : null}
        </div>

        <Button
          id="draw-bar-generate"
          onClick={onDraw}
          disabled={spinning}
          aria-busy={spinning}
          tabIndex={visible ? undefined : -1}
        >
          <ArrowsClockwiseIcon weight="regular" className={cn(spinning && "animate-spin")} />
          {spinning ? "Sorteando…" : "Tentar outros números"}
        </Button>
      </div>
    </div>
  );
}
