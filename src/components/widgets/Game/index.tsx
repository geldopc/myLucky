import { Ball } from "@elements/Ball";
import { CheckCircleIcon, CircleDashedIcon } from "@phosphor-icons/react";
import { cn } from "@utils/css";
import type { Game as GameModel } from "@utils/wheel";

type GameProps = {
  game: GameModel;
  played: boolean;
  onToggle: () => void;
};

export function Game({ game, played, onToggle }: GameProps) {
  return (
    <li>
      <button
        type="button"
        id={`game-${game.index}`}
        aria-pressed={played}
        aria-label={`Jogo ${game.index}${played ? ", já jogado" : ", marcar como jogado"}`}
        onClick={onToggle}
        className={cn(
          "group flex w-full flex-col gap-3 rounded-3xl p-4 text-left ring-1 transition-all",
          "hover:ring-2 hover:ring-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none",
          played
            ? "bg-muted ring-transparent"
            : "bg-card ring-foreground/5 hover:-translate-y-0.5 hover:shadow-md dark:ring-foreground/10"
        )}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            {played ? (
              <CheckCircleIcon weight="fill" className="size-4" />
            ) : (
              <CircleDashedIcon
                weight="regular"
                className="size-4 text-muted-foreground group-hover:text-foreground"
              />
            )}
            <span className="font-heading text-sm">Jogo {String(game.index).padStart(2, "0")}</span>
          </span>
          <span
            className={cn(
              "font-mono text-xs",
              played ? "text-muted-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {played ? "jogado" : `+${String(game.extra).padStart(2, "0")}`}
          </span>
        </span>

        <span className={cn("flex flex-wrap gap-1.5 transition-opacity", played && "opacity-40")}>
          {game.numbers.map((value) => (
            <Ball key={value} value={value} size="sm" tone={value === game.extra ? "extra" : "pool"} />
          ))}
        </span>
      </button>
    </li>
  );
}

type GameListProps = {
  games: GameModel[];
  isPlayed: (index: number) => boolean;
  onToggle: (index: number) => void;
  className?: string;
};

export function GameList({ games, isPlayed, onToggle, className }: GameListProps) {
  return (
    <ul id="game-list" className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {games.map((game) => (
        <Game
          key={game.index}
          game={game}
          played={isPlayed(game.index)}
          onToggle={() => onToggle(game.index)}
        />
      ))}
    </ul>
  );
}
