import { Ball } from "@elements/Ball";
import { ElectricBorder } from "@elements/ElectricBorder";
import { CheckCircleIcon, CircleDashedIcon } from "@phosphor-icons/react";
import { cn } from "@utils/css";
import type { Game as GameModel } from "@utils/wheel";
import * as React from "react";

type GameProps = {
  game: GameModel;
  played: boolean;
  onToggle: () => void;
};

export function Game({ game, played, onToggle }: GameProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <li>
      <button
        type="button"
        id={`game-${game.index}`}
        aria-pressed={played}
        aria-label={`Jogo ${game.index}${played ? ", já jogado" : ", marcar como jogado"}`}
        onClick={onToggle}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "group relative flex w-full flex-col gap-3 rounded-3xl p-4 text-left ring-1 transition-all focus-visible:outline-none",
          played
            ? "bg-muted ring-transparent"
            : "bg-card ring-foreground/5 hover:-translate-y-0.5 hover:shadow-lg dark:ring-foreground/10"
        )}
      >
        <ElectricBorder active={focused && !played} borderRadius={24} />

        <span className="relative z-20 flex items-center justify-between gap-2">
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

        <span
          className={cn("relative z-20 flex flex-wrap gap-1.5 transition-opacity", played && "opacity-40")}
        >
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
