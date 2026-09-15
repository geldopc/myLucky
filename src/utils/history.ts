export type Draw = {
  contest: number;
  date: string;
  numbers: number[];
};

export type History = {
  first: number;
  last: number;
  updatedAt: string;
  nextDrawDate?: string | null;
  dates: string[];
  draws: number[][];
};

export const UNIVERSE = 25;
export const DRAW_SIZE = 15;
export const POOL_SIZE = 14;

export function toDraws(history: History): Draw[] {
  return history.draws.map((numbers, index) => ({
    contest: history.first + index,
    date: history.dates[index],
    numbers,
  }));
}

export async function loadHistory(signal?: AbortSignal): Promise<History> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/history.json`, { signal });
  if (!response.ok) throw new Error(`Não foi possível carregar o histórico (HTTP ${response.status})`);
  return response.json();
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
