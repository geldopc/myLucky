export const TICKET_PRICE = 3.5;

export const GAMES_PER_SET = 11;

export const FIXED_PRIZES: Record<number, number> = { 11: 7, 12: 14, 13: 35 };

export function costOf(sets: number): number {
  return sets * GAMES_PER_SET * TICKET_PRICE;
}

export function formatMoney(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
