import { readFileSync, writeFileSync } from "node:fs";

const FILE = "public/data/history.json";
const API = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
const HEADERS = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

async function fetchContest(n = "") {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${API}/${n}`, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const numbers = (raw.listaDezenas ?? []).map(Number).sort((a, b) => a - b);
      if (numbers.length !== 15) throw new Error(`concurso ${raw.numero} veio com ${numbers.length} dezenas`);
      const [d, m, y] = raw.dataApuracao.split("/");
      return { contest: raw.numero, date: `${y}-${m}-${d}`, numbers, nextDate: raw.dataProximoConcurso ?? null };
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

const history = JSON.parse(readFileSync(FILE, "utf8"));
const latest = await fetchContest();
console.log(`local: ${history.last} | Caixa: ${latest.contest}`);

if (latest.contest <= history.last) {
  console.log("Histórico já está atualizado.");
  process.exit(0);
}

for (let n = history.last + 1; n <= latest.contest; n++) {
  const draw = n === latest.contest ? latest : await fetchContest(n);
  history.dates.push(draw.date);
  history.draws.push(draw.numbers);
  history.last = draw.contest;
  console.log(`+ concurso ${draw.contest} (${draw.date}): ${draw.numbers.join(" ")}`);
}

if (history.draws.length !== history.last - history.first + 1) {
  throw new Error("Contagem inconsistente após atualização — nada foi gravado.");
}

const [d, m, y] = (latest.nextDate ?? "").split("/");
history.nextDrawDate = y ? `${y}-${m}-${d}` : null;
history.updatedAt = new Date().toISOString();
writeFileSync(FILE, JSON.stringify(history));
console.log(`OK: ${history.draws.length} concursos. Próximo sorteio: ${history.nextDrawDate ?? "desconhecido"}`);
