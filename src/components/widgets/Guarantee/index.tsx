import { guaranteeTable } from "@utils/wheel";

export function Guarantee({ poolHits }: { poolHits?: number }) {
  const rows = guaranteeTable();
  return (
    <div id="guarantee" className="overflow-x-auto">
      <table className="w-full min-w-md border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
            <th className="py-2 pr-4 font-normal">Acertos nas 14 fixas</th>
            <th className="py-2 pr-4 font-normal">Garantido</th>
            <th className="py-2 font-normal">Demais jogos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.poolHits}
              data-active={poolHits === row.poolHits}
              className="border-b border-border/50 last:border-0 data-[active=true]:bg-muted"
            >
              <td className="py-2.5 pr-4 font-mono tabular-nums">{row.poolHits}</td>
              <td className="py-2.5 pr-4">
                <span className="font-heading">
                  {row.high.games} jogo{row.high.games === 1 ? "" : "s"} de {row.high.points} pontos
                </span>
              </td>
              <td className="py-2.5 text-muted-foreground">
                {row.low.games} de {row.low.points} pontos
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
