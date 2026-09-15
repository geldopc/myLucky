import { Separator } from "@elements/Separator";

export function Transparency() {
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
        desdobramento de 14 dezenas fixas em 11 jogos não depende de sorte: se as suas 14 contêm 11 das 15
        sorteadas, você
        <span className="text-foreground"> garante</span> 4 jogos de 12 pontos e 7 de 11 — sempre. Isso é
        combinatória, é verificável, e é o que a tabela acima mostra.
      </p>
      <p>
        Os 11 jogos custam R$ 38,50 e devolvem, em média, R$ 18,01 por concurso — retorno de −53%. Isso vale
        para qualquer estratégia de Lotofácil: é a margem da loteria, e nenhum sistema a contorna. Jogue por
        diversão.
      </p>
    </section>
  );
}
