import { costOf, formatMoney, GAMES_PER_SET, TICKET_PRICE } from "@utils/pricing";

export function Cost({ sets }: { sets: number }) {
  const games = sets * GAMES_PER_SET;
  return (
    <div
      id="cost"
      className="flex flex-col gap-4 rounded-3xl bg-foreground px-6 py-5 text-background sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs tracking-wide uppercase opacity-60">Você vai investir</span>
        <span className="font-heading text-4xl tabular-nums sm:text-5xl">{formatMoney(costOf(sets))}</span>
      </div>
      <div className="flex flex-col gap-1 text-sm sm:items-end">
        <span className="tabular-nums">
          {games} jogos × {formatMoney(TICKET_PRICE)}
        </span>
        <span className="opacity-60">
          {sets === 1 ? "sua sequência da sorte" : `suas ${sets} sequências da sorte`}
        </span>
      </div>
    </div>
  );
}
