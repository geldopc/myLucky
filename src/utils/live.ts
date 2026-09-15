import type { Draw } from "@utils/history";

const API = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
const TIMEOUT_MS = 12000;
const MAX_CATCH_UP = 12;

type CaixaDraw = {
  numero: number;
  dataApuracao: string;
  listaDezenas: string[];
  dataProximoConcurso?: string | null;
};

export type LiveResult = {
  draws: Draw[];
  nextDrawDate: string | null;
};

function toIsoDate(value: string): string {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function toDraw(raw: CaixaDraw): Draw {
  const numbers = (raw.listaDezenas ?? []).map(Number).sort((a, b) => a - b);
  if (numbers.length !== 15 || new Set(numbers).size !== 15) {
    throw new Error(`Concurso ${raw.numero} veio com dezenas inválidas`);
  }
  return { contest: raw.numero, date: toIsoDate(raw.dataApuracao), numbers };
}

async function fetchContest(contest?: number, signal?: AbortSignal): Promise<CaixaDraw> {
  const response = await fetch(`${API}/${contest ?? ""}`, {
    signal: signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function fetchDrawsSince(lastKnown: number, signal?: AbortSignal): Promise<LiveResult> {
  const latest = await fetchContest(undefined, signal);
  const nextDrawDate = latest.dataProximoConcurso ? toIsoDate(latest.dataProximoConcurso) : null;

  if (latest.numero <= lastKnown) return { draws: [], nextDrawDate };

  const missing = Math.min(latest.numero - lastKnown, MAX_CATCH_UP);
  const first = latest.numero - missing + 1;
  const draws: Draw[] = [];

  for (let contest = first; contest < latest.numero; contest++) {
    draws.push(toDraw(await fetchContest(contest, signal)));
  }
  draws.push(toDraw(latest));

  return { draws, nextDrawDate };
}
