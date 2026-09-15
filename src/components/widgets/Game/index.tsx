import { Ball } from "@elements/Ball";
import { cn } from "@utils/css";
import type { Game as GameModel } from "@utils/wheel";

type GameProps = {
  game: GameModel;
  highlight?: number[];
};

export function Game({ game, highlight }: GameProps) {
  const extras = new Set(highlight ?? [game.extra]);
  return (
    <li
      id={`game-${game.index}`}
      className="flex flex-col gap-3 rounded-3xl bg-card p-4 ring-1 ring-foreground/5 dark:ring-foreground/10"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-sm">Jogo {String(game.index).padStart(2, "0")}</span>
        <span className="font-mono text-xs text-muted-foreground">
          +{String(game.extra).padStart(2, "0")}
        </span>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {game.numbers.map((value) => (
          <li key={value}>
            <Ball value={value} size="sm" tone={extras.has(value) ? "extra" : "pool"} />
          </li>
        ))}
      </ul>
    </li>
  );
}

export function GameList({ games, className }: { games: GameModel[]; className?: string }) {
  return (
    <ul id="game-list" className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {games.map((game) => (
        <Game key={game.index} game={game} />
      ))}
    </ul>
  );
}
