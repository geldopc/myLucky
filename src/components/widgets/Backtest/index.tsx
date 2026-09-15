import { Stat } from "@elements/Stat";
import type { Backtest as BacktestModel } from "@utils/backtest";
import { cn } from "@utils/css";
import { FIXED_PRIZES, formatMoney } from "@utils/pricing";
import { Prizes } from "@widgets/Prizes";
import { Shuffling } from "@widgets/Shuffling";

const TRACKED = [15, 14, 13, 12, 11];

function Placeholder({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="h-3 w-24 animate-pulse rounded-full bg-muted" />
      <span className={cn("h-8 animate-pulse rounded-lg bg-muted", wide ? "w-28" : "w-16")} />
      <span className="h-3 w-20 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

export function Backtest({ result, loading = false }: { result: BacktestModel; loading?: boolean }) {
  const rate = ((result.prizeContests / result.contests) * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const awarded = TRACKED.reduce((acc, points) => acc + (result.distribution.get(points) ?? 0), 0);

  if (loading) {
    return (
      <div id="backtest" className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          <Placeholder wide />
          <Placeholder wide />
          {TRACKED.map((points) => (
            <Placeholder key={points} />
          ))}
        </div>
        <Shuffling label="Conferindo em 3.779 concursos…" />
      </div>
    );
  }

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
          value={result.prizeContests.toLocaleString("pt-BR")}
          hint={`${rate}% dos ${result.contests.toLocaleString("pt-BR")} sorteios`}
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
          Concursos que teriam premiado você
          <span className="ml-2 font-sans text-xs normal-case opacity-70">
            clique numa linha para ver os acertos
          </span>
        </h3>

        <Prizes hits={result.best} />

        <p className="text-xs text-muted-foreground">
          Os valores são os prêmios fixos da Caixa: {formatMoney(FIXED_PRIZES[11])} por 11 pontos,{" "}
          {formatMoney(FIXED_PRIZES[12])} por 12 e {formatMoney(FIXED_PRIZES[13])} por 13. Os de 14 e 15
          pontos saem por rateio e variam a cada concurso, por isso aparecem à parte. Somando só os fixos,
          estes números já teriam pago{" "}
          <span className="text-foreground tabular-nums">{formatMoney(result.fixedPrizeTotal)}</span>.
        </p>
      </div>
    </div>
  );
}
