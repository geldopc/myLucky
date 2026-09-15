import { Button } from "@elements/Button";
import { Logomark } from "@elements/Logomark";
import { useTheme } from "@hooks/Theme";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header
      id="header"
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <Logomark className="shrink-0" />
          <span className="flex items-baseline gap-2">
            <span className="font-heading text-lg tracking-tight">
              <span className="font-extralight">my</span>
              <span className="font-semibold">Lucky</span>
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">Lotofácil</span>
          </span>
        </a>
        <Button
          id="theme-toggle"
          variant="ghost"
          size="icon"
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <SunIcon weight="regular" /> : <MoonIcon weight="regular" />}
        </Button>
      </div>
    </header>
  );
}
