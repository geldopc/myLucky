import { Stat } from "@elements/Stat";
import type { Backtest as BacktestModel } from "@utils/backtest";
import { formatMoney } from "@utils/pricing";
import { Hit } from "@widgets/Backtest/Hit";

const TRACKED = [15, 14, 13, 12, 11];

export function Backtest({ result }: { result: BacktestModel }) {
  const rate = ((result.prizeContests / result.contests) * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const awarded = TRACKED.reduce((acc, points) => acc + (result.distribution.get(points) ?? 0), 0);

  return (
    <div id="backtest" className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          id="backtest-awarded"
          label="Jogos premiados"
          value={awarded.toLocaleString("pt-BR")}
          hint="em toda a história"
          emphasis
        />
        <Stat
          id="backtest-rate"
          label="Concursos que pagariam"
          value={`${rate}%`}
          hint={`de ${result.contests.toLocaleString("pt-BR")} sorteios`}
          emphasis
        />
        {TRACKED.map((points) => (
          <Stat
            key={points}
            id={`backtest-${points}`}
            label={`${points} pontos`}
            value={(result.distribution.get(points) ?? 0).toLocaleString("pt-BR")}
            hint="jogos"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
          Suas melhores premiações
          <span className="ml-2 font-sans text-xs normal-case opacity-70">
            passe o mouse ou toque para ver os acertos
          </span>
        </h3>
        <ul className="flex flex-col">
          {result.best.map((hit) => (
            <Hit key={hit.contest} hit={hit} />
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Só nos prêmios fixos de 11, 12 e 13 pontos, estes números já teriam pago{" "}
          <span className="text-foreground tabular-nums">{formatMoney(result.fixedPrizeTotal)}</span> ao longo
          da série.
        </p>
      </div>
    </div>
  );
}
