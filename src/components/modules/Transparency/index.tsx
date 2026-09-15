import { Separator } from "@elements/Separator";
import { costOf, formatMoney, GAMES_PER_SET, TICKET_PRICE } from "@utils/pricing";

const EXPECTED_RETURN = 16.36;

export function Transparency() {
  const cost = costOf(1);
  const loss = (1 - EXPECTED_RETURN / cost) * 100;

  return (
    <section id="transparency" className="flex flex-col gap-4 text-sm text-muted-foreground">
      <Separator />
      <h2 className="font-heading text-sm tracking-wide text-foreground uppercase">Jogue sabendo</h2>
      <p>
        A parte boa é de verdade: a cobertura dos 11 jogos é{" "}
        <span className="text-foreground">garantida</span>. Se as suas 14 dezenas pegarem 11 das 15 sorteadas,
        você leva 4 jogos de 12 pontos e 7 de 11 — sempre, sem depender de sorte nenhuma. Isso é combinatória
        pura, e a tabela acima mostra cada caso.
      </p>
      <p>
        Agora a parte honesta: a Lotofácil é um sorteio uniforme, então nenhum filtro estatístico aumenta a
        chance de um jogo sair. Comparamos as faixas históricas com 200 mil combinações aleatórias e a
        aprovação é igualzinha. O que os filtros fazem é dar aos seus números o mesmo perfil dos sorteios que
        realmente aconteceram — e manter longe as combinações esquisitas, tipo 1 a 15 em sequência.
      </p>
      <p>
        Cada sequência custa <span className="text-foreground tabular-nums">{formatMoney(cost)}</span> (
        {GAMES_PER_SET} × {formatMoney(TICKET_PRICE)}) e devolve, na média,{" "}
        <span className="text-foreground tabular-nums">{formatMoney(EXPECTED_RETURN)}</span> por concurso — ou
        seja,{" "}
        <span className="text-foreground tabular-nums">
          −{loss.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
        </span>{" "}
        no longo prazo. Isso vale para qualquer jeito de jogar Lotofácil: é a margem da loteria. Jogue o que
        você pode perder, e boa sorte de verdade. 🍀
      </p>
    </section>
  );
}
