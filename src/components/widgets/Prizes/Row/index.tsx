import { TableCell, TableRow } from "@elements/Table";
import type { BacktestHit } from "@utils/backtest";
import { cn } from "@utils/css";
import { formatDate } from "@utils/history";
import { formatMoney } from "@utils/pricing";
import { Tooltip, TooltipContent, TooltipTrigger } from "@widgets/Tooltip";
import * as React from "react";

export function PrizeRow({ hit }: { hit: BacktestHit }) {
  const [open, setOpen] = React.useState(false);
  const matched = new Set(hit.bestGame.filter((value) => hit.drawn.includes(value)));
  const rateio = hit.breakdown.filter((entry) => entry.points >= 14);
  const pontos = hit.breakdown
    .filter((entry) => entry.points >= 11)
    .map((entry) => `${entry.games}× ${entry.points}`)
    .join(" · ");

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={
          <TableRow
            id={`hit-${hit.contest}`}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="cursor-pointer"
          />
        }
      >
        <TableCell className="font-mono text-muted-foreground tabular-nums">{hit.contest}</TableCell>
        <TableCell className="font-mono text-muted-foreground tabular-nums">{formatDate(hit.date)}</TableCell>
        <TableCell>
          <span className="font-heading tabular-nums">{hit.best}</span>
          <span className="hidden text-muted-foreground sm:inline"> pts</span>
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">{pontos}</TableCell>
        <TableCell className="text-right">
          <span className="font-heading tabular-nums">{formatMoney(hit.prize)}</span>
          {rateio.length > 0 ? <span className="block text-xs text-muted-foreground">+ rateio</span> : null}
        </TableCell>
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
            ? ` · ${formatMoney(hit.prize)} nos fixos, mais o rateio de ${rateio
                .map((entry) => `${entry.games}× ${entry.points} pts`)
                .join(" e ")}`
            : ` · ${formatMoney(hit.prize)} em prêmios`}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
