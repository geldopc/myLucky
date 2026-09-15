import { Badge } from "@elements/Badge";
import { Ball } from "@elements/Ball";
import { Separator } from "@elements/Separator";
import { useHistory } from "@hooks/History";
import { Generator } from "@modules/Generator";
import { Transparency } from "@modules/Transparency";
import { formatDate } from "@utils/history";

export function Home() {
  const { history, draws, loading, error, liveContests } = useHistory();

  if (loading) {
    return (
      <p id="home-loading" className="text-sm text-muted-foreground">
        Preparando seus números da sorte…
      </p>
    );
  }

  if (error || !history) {
    return (
      <p id="home-error" className="text-sm text-destructive">
        Não foi possível carregar o histórico. {error}
      </p>
    );
  }

  const lastDraw = draws.at(-1);

  return (
    <div id="home" className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <h1 className="font-heading max-w-3xl text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
          Seus números da sorte, com pontos garantidos.
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Escolhemos 14 números da sorte com a mesma cara dos sorteios que já saíram e os espalhamos em 11
          jogos que cobrem todas as dezenas restantes. Aí está a melhor parte: acertando dentro dos seus 14, a
          premiação já vem garantida pela matemática. E mostramos quanto estes números já teriam pago nos{" "}
          {draws.length.toLocaleString("pt-BR")} concursos da história.
        </p>

        {lastDraw ? (
          <div id="last-draw" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Último sorteio · nº {lastDraw.contest} · {formatDate(lastDraw.date)}
              </span>
              {liveContests > 0 ? (
                <Badge variant="outline" className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  atualizado agora
                </Badge>
              ) : null}
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {lastDraw.numbers.map((value) => (
                <li key={value}>
                  <Ball value={value} tone="muted" size="sm" />
                </li>
              ))}
            </ul>
            {history.nextDrawDate ? (
              <span className="text-xs text-muted-foreground">
                Próximo sorteio em {formatDate(history.nextDrawDate)} — dá tempo de escolher os seus.
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      <Separator />

      <Generator history={history} draws={draws} />

      <Transparency />
    </div>
  );
}
