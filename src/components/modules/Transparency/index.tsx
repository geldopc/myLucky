import { Separator } from "@elements/Separator";
import { costOf, formatMoney, GAMES_PER_SET, TICKET_PRICE } from "@utils/pricing";

const EXPECTED_RETURN = 16.36;

export function Transparency() {
  const cost = costOf(1);
  const loss = (1 - EXPECTED_RETURN / cost) * 100;

  return (
    <section id="transparency" className="flex flex-col gap-4 text-sm text-muted-foreground">
      <Separator />
      <h2 className="font-heading text-sm tracking-wide text-foreground uppercase">
        A matemática, sem marketing
      </h2>
      <p>
        Nenhum filtro estatístico aumenta a probabilidade de um jogo ser sorteado. Testamos as faixas
        históricas (pares, soma, primos, moldura, repetidos) contra 200 mil combinações aleatórias: a taxa de
        aprovação é idêntica — ganho de <span className="font-mono text-foreground">1,00×</span>. O motivo é
        estrutural: os sorteios reais <em>são</em> aleatórios, então têm exatamente o mesmo perfil estatístico
        de qualquer sorteio.
      </p>
      <p>
        O que este app faz de real é <span className="text-foreground">cobertura garantida</span>. O
        desdobramento de 14 dezenas fixas em {GAMES_PER_SET} jogos não depende de sorte: se as suas 14 contêm
        11 das 15 sorteadas, você <span className="text-foreground">garante</span> 4 jogos de 12 pontos e 7 de
        11 — sempre. Isso é combinatória, é verificável, e é o que a tabela de garantia mostra.
      </p>
      <p>
        Cada conjunto custa <span className="text-foreground tabular-nums">{formatMoney(cost)}</span> (
        {GAMES_PER_SET} × {formatMoney(TICKET_PRICE)}) e devolve, em média,{" "}
        <span className="text-foreground tabular-nums">{formatMoney(EXPECTED_RETURN)}</span> por concurso —
        retorno de <span className="text-foreground tabular-nums">−{loss.toFixed(0)}%</span>. A conta é exata:
        a distribuição de acertos é hipergeométrica, e as chances de 14 e 15 pontos são de{" "}
        <span className="font-mono text-foreground">0,00034%</span> e{" "}
        <span className="font-mono text-foreground">0,0000306%</span> por conjunto. Isso vale para qualquer
        estratégia de Lotofácil: é a margem da loteria, e nenhum sistema a contorna. Jogue por diversão.
      </p>
    </section>
  );
}
