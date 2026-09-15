import { Button } from "@elements/Button";
import { Cost } from "@elements/Cost";
import { Separator } from "@elements/Separator";
import { useDraft } from "@hooks/Draft";
import { useOnScreen } from "@hooks/OnScreen";
import { revealDuration, usePrefersReducedMotion } from "@hooks/Reveal";
import { DrawBar } from "@modules/DrawBar";
import { Wheels } from "@modules/Wheels";
import { ArrowDownIcon, ArrowsClockwiseIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { runBacktest } from "@utils/backtest";
import { cn } from "@utils/css";
import { type Draw, formatDate, type History, POOL_SIZE } from "@utils/history";
import { costOf, GAMES_PER_SET } from "@utils/pricing";
import { derivePoolBands } from "@utils/stats";
import { playedKey } from "@utils/storage";
import { buildWheels, resolveActiveSet } from "@utils/wheel";
import { Backtest } from "@widgets/Backtest";
import { Guarantee } from "@widgets/Guarantee";
import { SetPicker } from "@widgets/SetPicker";
import * as React from "react";

const BACKTEST_OBSERVER: IntersectionObserverInit = { rootMargin: "-10% 0px -45% 0px" };

const COVERAGE = 0.97;
const MIN_SETS = 1;
const MAX_SETS = 10;

type GeneratorProps = {
  history: History;
  draws: Draw[];
};

export function Generator({ history, draws }: GeneratorProps) {
  const { seed, sets, played, setSets, redraw, togglePlayed, clearSet } = useDraft(MIN_SETS, MAX_SETS);
  const [copied, setCopied] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [activeSet, setActiveSet] = React.useState(1);
  const backtestArea = useOnScreen<HTMLElement>(BACKTEST_OBSERVER);

  const bands = React.useMemo(() => derivePoolBands(history.draws, POOL_SIZE, COVERAGE), [history.draws]);
  const previous = history.draws.at(-1);
  const lastDraw = draws.at(-1);

  const wheels = React.useMemo(() => buildWheels(sets, bands, previous, seed), [sets, bands, previous, seed]);
  const currentSet = resolveActiveSet(wheels, activeSet);
  const currentWheel = wheels.find((wheel) => wheel.set === currentSet);
  const multiple = wheels.length > 1;

  const backtest = React.useMemo(
    () => runBacktest(currentWheel ? [currentWheel] : [], draws),
    [currentWheel, draws]
  );
  const totals = React.useMemo(
    () => (wheels.length > 1 ? runBacktest(wheels, draws) : null),
    [wheels, draws]
  );

  const step = React.useCallback(
    (delta: number) => {
      if (wheels.length === 0) return;
      const index = wheels.findIndex((wheel) => wheel.set === currentSet);
      const next = (index + delta + wheels.length) % wheels.length;
      setActiveSet(wheels[next].set);
    },
    [wheels, currentSet]
  );

  const draw = React.useCallback(() => {
    redraw();
    if (reducedMotion) return;
    setSpinning(true);
  }, [reducedMotion, redraw]);

  const playedCount = React.useCallback(
    (set: number) => {
      let total = 0;
      for (let index = 1; index <= GAMES_PER_SET; index++) {
        if (played.has(playedKey(set, index))) total++;
      }
      return total;
    },
    [played]
  );

  const totalPlayed = wheels.reduce((acc, wheel) => acc + playedCount(wheel.set), 0);

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

      <Wheels
        wheels={wheels}
        bands={bands}
        previous={previous}
        spinning={spinning}
        active={currentSet}
        onActiveChange={setActiveSet}
        playedCount={playedCount}
        isPlayed={(set, gameIndex) => played.has(playedKey(set, gameIndex))}
        onToggle={(set, gameIndex) => togglePlayed(playedKey(set, gameIndex))}
        onClear={clearSet}
      />

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
        ref={backtestArea.ref}
        id="backtest-section"
        className={cn("flex scroll-mt-24 flex-col gap-6 transition-opacity duration-500")}
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            {multiple ? `Como a sorte ${currentSet} teria se saído` : "Quanto estes números já teriam pago"}
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Os {backtest.games} jogos desta sequência conferidos contra todos os concursos da história, do nº{" "}
            {history.first} ao nº {history.last}
            {lastDraw ? ` (${formatDate(lastDraw.date)})` : ""}.
            {totals ? (
              <>
                {" "}
                Somando suas {wheels.length} sequências, são{" "}
                <span className="text-foreground tabular-nums">
                  {totals.prizeContests.toLocaleString("pt-BR")}
                </span>{" "}
                concursos premiados.
              </>
            ) : null}
          </p>
        </div>
        <Backtest result={backtest} loading={spinning} />
      </section>

      <DrawBar
        wheel={currentWheel}
        totalSets={wheels.length}
        cost={costOf(wheels.length)}
        visible={backtestArea.visible}
        spinning={spinning}
        onDraw={draw}
        playedCount={playedCount(currentSet)}
        totalPlayed={totalPlayed}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </div>
  );
}
