# myLucky

**https://mylucky-lotofacil.vercel.app**

Gerador de desdobramentos para a Lotofácil. Sorteia 14 dezenas com o perfil estatístico dos sorteios
reais e as desdobra em 11 jogos que cobrem todas as dezenas restantes — o que torna a premiação
**determinística** em função de quantas dezenas você acerta dentro das 14 fixas.

## A garantia

| Acertos nas 14 fixas | Garantido | Demais jogos |
| --- | --- | --- |
| 14 | 1 jogo de 15 pontos | 10 de 14 pontos |
| 13 | 2 jogos de 14 pontos | 9 de 13 pontos |
| 12 | 3 jogos de 13 pontos | 8 de 12 pontos |
| 11 | 4 jogos de 12 pontos | 7 de 11 pontos |
| 10 | 5 jogos de 11 pontos | 6 de 10 pontos |

Isso é combinatória, não probabilidade: cada um dos 11 jogos repete as 14 fixas e adiciona uma das 11
dezenas de fora, cobrindo todas elas.

## Honestidade estatística

Filtros estatísticos **não** aumentam a chance de acerto. Testamos as faixas históricas (pares, soma,
primos, moldura, repetidos) contra 200 mil combinações aleatórias em 8 níveis de aperto: a taxa de
aprovação é idêntica — ganho de `1,00×`. Os sorteios reais *são* aleatórios, logo têm o mesmo perfil
estatístico de qualquer combinação.

A aposta de 15 dezenas custa **R$ 3,50** ([tabela oficial da CAIXA][precos]), então cada conjunto de
11 jogos custa **R$ 38,50** e devolve, em média, **R$ 16,36** por concurso — retorno de **−57,5%**. A
conta é exata: a distribuição de acertos no pool é hipergeométrica, com `P(k≥11) = 4,16%` e
`P(k≥10) = 18,31%` (valores que batem com a frequência medida nos 3.779 concursos reais). Essa é a
margem da loteria e nenhum sistema a contorna.

[precos]: https://loterias.caixa.gov.br/paginas/lotofacil.aspx

## Funcionalidades

- **N conjuntos sem repetição** — escolha de 1 a 10 conjuntos (11 a 110 jogos); nenhum jogo se repete
  entre conjuntos, garantido por teste automatizado.
- **Conjuntos em abas** — com mais de um conjunto os jogos vão para abas, então apenas 11 jogos ficam
  montados no DOM por vez em vez de até 110.
- **Custo em destaque** — total a apostar sempre visível, calculado sobre o preço real da aposta.
- **Comparação com o sorteio** — passe o mouse ou toque em qualquer resultado do backtest para ver as
  15 dezenas sorteadas com os seus acertos destacados.
- **Marcar o que já apostou** — cada jogo é um botão: clique ao apostar e ele fica marcado, com o
  progresso na aba ("Sorte 2 · 8/11") e um aviso quando a sequência inteira estiver feita. A sequência
  gerada e as marcações ficam no `localStorage`, então recarregar a página não perde nada — feito para
  conferir no computador enquanto se aposta pelo celular.
- **Todas as premiações** — o backtest lista todos os concursos que teriam pago (não uma amostra),
  começando por 8 e expandindo em lotes de 50.
- **Borda elétrica no hover** — passar o mouse num jogo acende uma borda animada, para não se perder
  entre os 11. Só o card sob o cursor monta o canvas, então há no máximo uma animação por vez.
- **Sorteio animado** — gerar é instantâneo, mas as 14 dezenas giram e travam uma a uma, ao lado de uma
  animação Lottie. O player entra por `import()` dinâmico, então vira um chunk separado (47 KB gzip) que
  só é baixado no primeiro sorteio; o bundle inicial não muda. Respeita `prefers-reduced-motion`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · React Router · Biome · Vitest

## Desenvolvimento

```bash
npm install
npm run dev
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | sobe o servidor de desenvolvimento |
| `npm run build` | typecheck + build de produção |
| `npm test` | testes do núcleo matemático |
| `npm run typecheck` | checagem de tipos do app e dos testes |
| `npm run check` | formata e corrige com Biome |
| `npm run history:update` | busca os concursos novos na API da Caixa |

## Histórico

`public/data/history.json` guarda todos os concursos desde o nº 1 (29/09/2003), e a atualização tem
duas camadas:

1. **Ao vivo, no navegador.** A API oficial da Caixa responde com CORS liberado, então o app consulta
   o último concurso a cada carregamento. Se houver sorteio novo, ele é anexado na hora (até 12
   concursos de atraso) e a página marca "atualizado agora". Se a API estiver fora, falha em silêncio
   e o app segue com o JSON — a animação e o backtest não dependem disso.
2. **Diária, no repositório.** Uma GitHub Action roda `npm run history:update` às 03:00 UTC, commita o
   JSON e o push redeploya. Isso mantém o arquivo-base em dia, para que o passo 1 quase nunca precise
   buscar mais de um concurso.

Os sorteios saem por volta das 20h (BRT), de segunda a sábado.

## Créditos

O efeito de borda animada é adaptado do [ElectricBorder](https://reactbits.dev) do React Bits —
Copyright (c) 2026 David Haz, sob MIT + Commons Clause License Condition v1.0. Foi modificado para
usar exportação nomeada, herdar a cor do tema, animar apenas o cartão sob o cursor e respeitar
`prefers-reduced-motion`.
