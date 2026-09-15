import type { BacktestHit } from "@utils/backtest";
import { cn } from "@utils/css";
import { formatDate } from "@utils/history";
import { formatMoney } from "@utils/pricing";
import { Tooltip, TooltipContent, TooltipTrigger } from "@widgets/Tooltip";
import * as React from "react";

export function Hit({ hit }: { hit: BacktestHit }) {
  const [open, setOpen] = React.useState(false);
  const matched = new Set(hit.bestGame.filter((value) => hit.drawn.includes(value)));
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
          className="flex w-full flex-wrap items-baseline justify-between gap-2 rounded-lg py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="font-mono text-muted-foreground tabular-nums">
            #{hit.contest} · {formatDate(hit.date)}
          </span>
          <span className="font-heading">{summary}</span>
        </TooltipTrigger>

        <TooltipContent className="max-w-none flex-col items-start gap-2 p-3">
          <span className="text-xs opacity-70">
            Concurso {hit.contest} · {formatDate(hit.date)} · conjunto {hit.bestSet}
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
            {hit.prize > 0 ? ` · ${formatMoney(hit.prize)} em prêmios fixos` : ""}
          </span>
        </TooltipContent>
      </Tooltip>
    </li>
  );
}
