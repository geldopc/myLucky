import { Ball } from "@elements/Ball";
import { Separator } from "@elements/Separator";
import { useHistory } from "@hooks/History";
import { Generator } from "@modules/Generator";
import { Transparency } from "@modules/Transparency";
import { formatDate } from "@utils/history";

export function Home() {
  const { history, draws, loading, error } = useHistory();

  if (loading) {
    return (
      <p id="home-loading" className="text-sm text-muted-foreground">
        Carregando o histórico da Lotofácil…
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
          11 jogos com cobertura garantida.
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Geramos 14 dezenas com o perfil estatístico dos sorteios reais e as desdobramos nos 11 jogos que
          cobrem todas as dezenas restantes. A garantia de pontos é matemática, não é sorte — e conferimos
          tudo contra os {draws.length.toLocaleString("pt-BR")} concursos já realizados.
        </p>

        {lastDraw ? (
          <div id="last-draw" className="flex flex-col gap-3">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              Último concurso · nº {lastDraw.contest} · {formatDate(lastDraw.date)}
            </span>
            <ul className="flex flex-wrap gap-1.5">
              {lastDraw.numbers.map((value) => (
                <li key={value}>
                  <Ball value={value} tone="muted" size="sm" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <Separator />

      <Generator history={history} draws={draws} />

      <Transparency />
    </div>
  );
}
