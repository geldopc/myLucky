import type { BacktestHit } from "@utils/backtest";
import { cn } from "@utils/css";
import { formatDate } from "@utils/history";
import { formatMoney } from "@utils/pricing";
import { Tooltip, TooltipContent, TooltipTrigger } from "@widgets/Tooltip";
import * as React from "react";

export function Hit({ hit }: { hit: BacktestHit }) {
  const [open, setOpen] = React.useState(false);
  const matched = new Set(hit.bestGame.filter((value) => hit.drawn.includes(value)));
  const rateio = hit.breakdown.filter((entry) => entry.points >= 14);
  const summary =
    hit.breakdown
      .filter((entry) => entry.points >= 11)
      .map((entry) => `${entry.games}× ${entry.points} pts`)
      .join(" · ") || `melhor: ${hit.best} pts`;

  return (
    <li className="border-b border-border/50 last:border-0">
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          id={`hit-${hit.contest}`}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="grid w-full grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 rounded-lg py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:grid-cols-[auto_1fr_auto]"
        >
          <span className="font-mono text-muted-foreground tabular-nums">
            #{hit.contest} · {formatDate(hit.date)}
          </span>
          <span className="col-span-2 text-muted-foreground sm:col-span-1 sm:text-center">{summary}</span>
          <span className="row-start-1 justify-self-end text-right sm:row-auto">
            <span className="font-heading tabular-nums">{formatMoney(hit.prize)}</span>
            {rateio.length > 0 ? (
              <span className="block text-xs text-muted-foreground">
                + {rateio.map((entry) => `${entry.games}× ${entry.points} pts`).join(" e ")}
              </span>
            ) : null}
          </span>
        </TooltipTrigger>

        <TooltipContent className="max-w-none flex-col items-start gap-2 p-3">
          <span className="text-xs opacity-70">
            Concurso {hit.contest} · {formatDate(hit.date)} · sorte {hit.bestSet}
          </span>

          <ul className="flex flex-wrap gap-1">
            {hit.drawn.map((value) => (
              <li key={value}>
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full font-mono text-[11px] tabular-nums",
                    matched.has(value) ? "bg-background text-foreground" : "opacity-40 ring-1 ring-current"
                  )}
                >
                  {String(value).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>

          <span className="text-xs">
            Seu melhor jogo acertou <strong>{matched.size} de 15</strong>
            {rateio.length > 0
              ? ` · ${formatMoney(hit.prize)} nos prêmios fixos, mais o rateio de ${rateio
                  .map((entry) => `${entry.games}× ${entry.points} pts`)
                  .join(" e ")}`
              : ` · ${formatMoney(hit.prize)} em prêmios`}
          </span>
        </TooltipContent>
      </Tooltip>
    </li>
  );
}
