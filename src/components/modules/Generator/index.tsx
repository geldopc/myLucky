import { Button } from "@elements/Button";
import { Cost } from "@elements/Cost";
import { Separator } from "@elements/Separator";
import { revealDuration, usePrefersReducedMotion } from "@hooks/Reveal";
import { Wheels } from "@modules/Wheels";
import { ArrowDownIcon, ArrowsClockwiseIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { runBacktest } from "@utils/backtest";
import { cn } from "@utils/css";
import { type Draw, formatDate, type History, POOL_SIZE } from "@utils/history";
import { randomSeed } from "@utils/random";
import { derivePoolBands } from "@utils/stats";
import { buildWheels } from "@utils/wheel";
import { Backtest } from "@widgets/Backtest";
import { Guarantee } from "@widgets/Guarantee";
import { SetPicker } from "@widgets/SetPicker";
import * as React from "react";

const COVERAGE = 0.97;
const MIN_SETS = 1;
const MAX_SETS = 10;

type GeneratorProps = {
  history: History;
  draws: Draw[];
};

export function Generator({ history, draws }: GeneratorProps) {
  const [seed, setSeed] = React.useState(() => randomSeed());
  const [sets, setSets] = React.useState(1);
  const [copied, setCopied] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const bands = React.useMemo(() => derivePoolBands(history.draws, POOL_SIZE, COVERAGE), [history.draws]);
  const previous = history.draws.at(-1);
  const lastDraw = draws.at(-1);

  const wheels = React.useMemo(() => buildWheels(sets, bands, previous, seed), [sets, bands, previous, seed]);
  const backtest = React.useMemo(() => runBacktest(wheels, draws), [wheels, draws]);

  const draw = React.useCallback(() => {
    setSeed(randomSeed());
    if (reducedMotion) return;
    setSpinning(true);
  }, [reducedMotion]);

  React.useEffect(() => {
    if (!spinning) return;
    const id = window.setTimeout(() => setSpinning(false), revealDuration(POOL_SIZE));
    return () => window.clearTimeout(id);
  }, [spinning]);

  const copyGames = React.useCallback(() => {
    const text = wheels
      .flatMap((wheel) =>
        wheel.games.map((game) => game.numbers.map((n) => String(n).padStart(2, "0")).join(" "))
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [wheels]);

  return (
    <div id="generator" className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            Quantas sequências da sorte
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Cada sequência são 14 números da sorte espalhados em 11 jogos, com garantia própria de pontos.
            Sequências diferentes nunca repetem um jogo entre si.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <SetPicker value={sets} min={MIN_SETS} max={MAX_SETS} onChange={setSets} />
          <div className="flex gap-2">
            <Button id="copy-games" variant="outline" onClick={copyGames} disabled={spinning}>
              {copied ? <CheckIcon weight="regular" /> : <CopyIcon weight="regular" />}
              {copied ? "Copiado" : "Copiar meus jogos"}
            </Button>
            <Button id="generate" onClick={draw} disabled={spinning} aria-busy={spinning}>
              <ArrowsClockwiseIcon weight="regular" className={cn(spinning && "animate-spin")} />
              {spinning ? "Sorteando…" : "Tentar outros números"}
            </Button>
          </div>
        </div>

        <Cost sets={wheels.length} />

        <a
          id="go-to-backtest"
          href="#backtest-section"
          className="inline-flex w-fit items-center gap-2 text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          <ArrowDownIcon weight="regular" />
          Ver quanto estes números já teriam pago
        </a>
      </section>

      <Separator />

      <Wheels wheels={wheels} bands={bands} previous={previous} spinning={spinning} />

      <Separator />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            O que você já garante
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Isto aqui não depende de sorte, é matemática. Dependendo de quantas das 15 sorteadas caírem nos
            seus 14 números, os 11 jogos rendem exatamente isto:
          </p>
        </div>
        <Guarantee />
      </section>

      <Separator />

      <section
        id="backtest-section"
        className={cn(
          "flex scroll-mt-24 flex-col gap-6 transition-opacity duration-500",
          spinning && "opacity-25"
        )}
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            Quanto estes números já teriam pago
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Os {backtest.games} jogos conferidos contra todos os concursos da história, do nº {history.first}{" "}
            ao nº {history.last}
            {lastDraw ? ` (${formatDate(lastDraw.date)})` : ""}.
          </p>
        </div>
        <Backtest result={backtest} />
      </section>
    </div>
  );
}
