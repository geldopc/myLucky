import { cn } from "@utils/css";

type StatProps = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
};

export function Stat({ id, label, value, hint, emphasis = false }: StatProps) {
  return (
    <div id={id} className="flex flex-col gap-1">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className={cn("font-heading tabular-nums", emphasis ? "text-3xl" : "text-xl")}>{value}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}
