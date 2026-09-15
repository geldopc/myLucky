import { Header } from "@modules/Header";
import { TooltipProvider } from "@providers/Tooltip";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <TooltipProvider>
      <div id="app-layout" className="flex min-h-svh flex-col bg-background text-foreground">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
          <Outlet />
        </main>
        <footer className="mx-auto w-full max-w-6xl px-5 py-8 text-xs text-muted-foreground sm:px-8">
          myLucky · seus números da sorte na Lotofácil · dados oficiais da Caixa
        </footer>
      </div>
    </TooltipProvider>
  );
}
