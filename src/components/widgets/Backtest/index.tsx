import { Stat } from "@elements/Stat";
import type { Backtest as BacktestModel } from "@utils/backtest";
import { formatDate } from "@utils/history";

const TRACKED = [15, 14, 13, 12, 11];

export function Backtest({ result }: { result: BacktestModel }) {
  const rate = ((result.prizeContests / result.contests) * 100).toFixed(1);
  return (
    <div id="backtest" className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          id="backtest-contests"
          label="Concursos testados"
          value={result.contests.toLocaleString("pt-BR")}
          emphasis
        />
        <Stat id="backtest-rate" label="Com prêmio" value={`${rate}%`} hint="ao menos 11 pontos" emphasis />
        {TRACKED.map((points) => (
          <Stat
            key={points}
            id={`backtest-${points}`}
            label={`${points} pontos`}
            value={(result.distribution.get(points) ?? 0).toLocaleString("pt-BR")}
            hint="jogos premiados"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
          Melhores resultados
        </h3>
        <ul className="flex flex-col gap-2">
          {result.best.map((hit) => (
            <li
              key={hit.contest}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 pb-2 text-sm last:border-0"
            >
              <span className="font-mono text-muted-foreground tabular-nums">
                #{hit.contest} · {formatDate(hit.date)}
              </span>
              <span className="font-heading">
                {hit.breakdown.map((entry) => `${entry.games}× ${entry.points} pts`).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
