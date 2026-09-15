import { Stat } from "@elements/Stat";
import type { Backtest as BacktestModel } from "@utils/backtest";
import { formatMoney } from "@utils/pricing";
import { Hit } from "@widgets/Backtest/Hit";

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
          hint={`${result.games} jogos por concurso`}
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
          <span className="ml-2 font-sans text-xs normal-case opacity-70">
            passe o mouse ou toque para comparar com o sorteio
          </span>
        </h3>
        <ul className="flex flex-col">
          {result.best.map((hit) => (
            <Hit key={hit.contest} hit={hit} />
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Somando os prêmios fixos de 11, 12 e 13 pontos em toda a série:{" "}
          <span className="text-foreground tabular-nums">{formatMoney(result.fixedPrizeTotal)}</span>.
        </p>
      </div>
    </div>
  );
}
