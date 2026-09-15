import { Lottie } from "@elements/Lottie";

export function Shuffling() {
  return (
    <div id="shuffling" className="flex flex-col items-center gap-3 py-6">
      <Lottie
        src={`${import.meta.env.BASE_URL}animations/shuffling.json`}
        label="Sorteando seus números da sorte"
        className="size-40 opacity-90 invert dark:invert-0"
      />
      <p className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
        Montando seus jogos…
      </p>
    </div>
  );
}
