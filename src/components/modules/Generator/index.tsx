import { Badge } from "@elements/Badge";
import { Ball } from "@elements/Ball";
import { Button } from "@elements/Button";
import { Separator } from "@elements/Separator";
import { ArrowsClockwiseIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { runBacktest } from "@utils/backtest";
import { generatePool } from "@utils/generator";
import { type Draw, formatDate, type History, POOL_SIZE } from "@utils/history";
import { randomSeed } from "@utils/random";
import { computeFeatures, derivePoolBands, FEATURE_LABELS, type FeatureKey } from "@utils/stats";
import { buildWheel } from "@utils/wheel";
import { Backtest } from "@widgets/Backtest";
import { GameList } from "@widgets/Game";
import { Guarantee } from "@widgets/Guarantee";
import * as React from "react";

const COVERAGE = 0.97;
const SHOWN_FEATURES: FeatureKey[] = ["even", "sum", "primes", "frame", "repeats"];

type GeneratorProps = {
  history: History;
  draws: Draw[];
};

export function Generator({ history, draws }: GeneratorProps) {
  const [seed, setSeed] = React.useState(() => randomSeed());
  const [copied, setCopied] = React.useState(false);

  const bands = React.useMemo(() => derivePoolBands(history.draws, POOL_SIZE, COVERAGE), [history.draws]);
  const previous = history.draws.at(-1);
  const lastDraw = draws.at(-1);

  const { pool } = React.useMemo(() => generatePool(bands, previous, seed), [bands, previous, seed]);
  const wheel = React.useMemo(() => buildWheel(pool), [pool]);
  const backtest = React.useMemo(() => runBacktest(wheel, draws), [wheel, draws]);
  const features = React.useMemo(() => computeFeatures(pool, previous), [pool, previous]);

  const copyGames = React.useCallback(() => {
    const text = wheel.games
      .map((game) => game.numbers.map((n) => String(n).padStart(2, "0")).join(" "))
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [wheel]);

  return (
    <div id="generator" className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
              As 14 dezenas fixas
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground">
              Sorteadas com o mesmo perfil estatístico dos {draws.length.toLocaleString("pt-BR")} concursos já
              realizados, e desdobradas nos 11 jogos abaixo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button id="copy-games" variant="outline" onClick={copyGames}>
              {copied ? <CheckIcon weight="regular" /> : <CopyIcon weight="regular" />}
              {copied ? "Copiado" : "Copiar jogos"}
            </Button>
            <Button id="generate" onClick={() => setSeed(randomSeed())}>
              <ArrowsClockwiseIcon weight="regular" />
              Gerar novamente
            </Button>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2">
          {wheel.pool.map((value) => (
            <li key={value}>
              <Ball value={value} tone="pool" />
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          {SHOWN_FEATURES.map((key) => (
            <Badge key={key} variant="outline" className="font-mono">
              {FEATURE_LABELS[key]} {features[key]}
              <span className="text-muted-foreground">
                /{bands[key].min}–{bands[key].max}
              </span>
            </Badge>
          ))}
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">Os 11 jogos</h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Cada jogo repete as 14 fixas e adiciona uma das 11 dezenas de fora — cobrindo todas elas. É isso
            que torna a garantia abaixo determinística.
          </p>
        </div>
        <GameList games={wheel.games} />
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            Garantia de cobertura
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Não é probabilidade, é combinatória. Dado quantas das 15 sorteadas caírem nas suas 14 fixas, o
            resultado dos 11 jogos é exatamente este:
          </p>
        </div>
        <Guarantee />
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
            Como estes jogos teriam se saído
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Estes 11 jogos conferidos contra todos os concursos da história, do nº {history.first} ao nº{" "}
            {history.last}
            {lastDraw ? ` (${formatDate(lastDraw.date)})` : ""}.
          </p>
        </div>
        <Backtest result={backtest} />
      </section>
    </div>
  );
}
