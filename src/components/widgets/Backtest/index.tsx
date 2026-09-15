import { Button } from "@elements/Button";
import { Stat } from "@elements/Stat";
import type { Backtest as BacktestModel } from "@utils/backtest";
import { FIXED_PRIZES, formatMoney } from "@utils/pricing";
import { Hit } from "@widgets/Backtest/Hit";
import * as React from "react";

const TRACKED = [15, 14, 13, 12, 11];

const INITIAL_ROWS = 8;
const STEP = 50;

export function Backtest({ result }: { result: BacktestModel }) {
  const [visible, setVisible] = React.useState(INITIAL_ROWS);
  const [lastResult, setLastResult] = React.useState(result);
  if (lastResult !== result) {
    setLastResult(result);
    setVisible(INITIAL_ROWS);
  }

  const shown = result.best.slice(0, visible);
  const remaining = result.best.length - shown.length;
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
            passe o mouse ou toque para ver os acertos
          </span>
        </h3>
        <ul className="flex flex-col">
          {shown.map((hit) => (
            <Hit key={hit.contest} hit={hit} />
          ))}
        </ul>

        {remaining > 0 || visible > INITIAL_ROWS ? (
          <div className="flex flex-wrap items-center gap-2">
            {remaining > 0 ? (
              <Button
                id="show-more-best"
                variant="outline"
                size="sm"
                onClick={() => setVisible((current) => current + STEP)}
              >
                Ver mais {Math.min(STEP, remaining)} de {remaining.toLocaleString("pt-BR")}
              </Button>
            ) : null}
            {visible > INITIAL_ROWS ? (
              <Button id="show-less-best" variant="ghost" size="sm" onClick={() => setVisible(INITIAL_ROWS)}>
                Recolher
              </Button>
            ) : null}
          </div>
        ) : null}
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
