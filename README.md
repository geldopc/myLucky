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

`public/data/history.json` guarda todos os concursos desde o nº 1 (29/09/2003). A atualização é
automática: um cron diário na Vercel dispara `npm run history:update`, que consulta a API oficial da
Caixa e adiciona apenas os concursos que faltam.
