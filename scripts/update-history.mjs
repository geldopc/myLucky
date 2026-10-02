import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const FILE = "public/data/history.json";
const API = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "application/json",
};

const ATTEMPTS = 5;
const TIMEOUT_MS = 25000;
const TRANSIENT_STATUS = new Set([403, 408, 425, 429, 500, 502, 503, 504, 522, 524]);

class TransientError extends Error {}

function summarize(line) {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
  }
}

function isTransient(error) {
  if (error instanceof TransientError) return true;
  // timeout do AbortSignal, DNS, socket, TLS: a requisição nem chegou a uma resposta válida
  return ["TimeoutError", "AbortError", "TypeError", "FetchError"].includes(error.name);
}

async function fetchContest(contest = "") {
  let last;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${API}/${contest}`, {
        headers: HEADERS,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (TRANSIENT_STATUS.has(response.status)) {
        throw new TransientError(`HTTP ${response.status}`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const raw = await response.json();
      const numbers = (raw.listaDezenas ?? []).map(Number).sort((a, b) => a - b);
      if (numbers.length !== 15 || new Set(numbers).size !== 15) {
        throw new Error(`concurso ${raw.numero} veio com dezenas inválidas: ${numbers.join(" ")}`);
      }
      const [day, month, year] = raw.dataApuracao.split("/");
      return {
        contest: raw.numero,
        date: `${year}-${month}-${day}`,
        numbers,
        nextDate: raw.dataProximoConcurso ?? null,
      };
    } catch (error) {
      last = error;
      if (!isTransient(error) || attempt === ATTEMPTS) throw error;
      const backoff = Math.round(2 ** attempt * 500 + Math.random() * 500);
      console.log(`  tentativa ${attempt}/${ATTEMPTS} falhou (${error.message}); nova tentativa em ${backoff}ms`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
  throw last;
}

async function main() {
  const history = JSON.parse(readFileSync(FILE, "utf8"));
  const latest = await fetchContest();
  console.log(`local: ${history.last} | Caixa: ${latest.contest}`);

  if (latest.contest <= history.last) {
    summarize(`Histórico já está atualizado no concurso ${history.last}.`);
    return;
  }

  for (let contest = history.last + 1; contest <= latest.contest; contest++) {
    const draw = contest === latest.contest ? latest : await fetchContest(contest);
    history.dates.push(draw.date);
    history.draws.push(draw.numbers);
    history.last = draw.contest;
    console.log(`+ concurso ${draw.contest} (${draw.date}): ${draw.numbers.join(" ")}`);
  }

  if (history.draws.length !== history.last - history.first + 1) {
    throw new Error("Contagem inconsistente após atualização — nada foi gravado.");
  }

  const [day, month, year] = (latest.nextDate ?? "").split("/");
  history.nextDrawDate = year ? `${year}-${month}-${day}` : null;
  history.updatedAt = new Date().toISOString();
  writeFileSync(FILE, JSON.stringify(history));
  summarize(
    `${history.draws.length} concursos até o nº ${history.last}. Próximo sorteio: ${history.nextDrawDate ?? "desconhecido"}.`
  );
}

try {
  await main();
} catch (error) {
  if (isTransient(error)) {
    // A API da Caixa cai com frequência (403/504). O histórico não fica para trás: a execução
    // seguinte busca todos os concursos faltantes, e o app já consulta a API ao vivo no navegador.
    // Falhar o job aqui só geraria e-mail de alerta para um problema que se resolve sozinho.
    summarize(
      `API da Caixa indisponível (${error.message}) após ${ATTEMPTS} tentativas. Nada a fazer — a próxima execução recupera o atraso.`
    );
    process.exit(0);
  }
  console.error(error);
  process.exit(1);
}
