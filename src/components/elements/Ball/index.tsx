import { cn } from "@utils/css";

type BallProps = {
  value: number;
  tone?: "pool" | "extra" | "muted";
  size?: "default" | "sm";
};

const TONES = {
  pool: "bg-foreground text-background ring-foreground",
  extra: "bg-background text-foreground ring-foreground",
  muted: "bg-muted text-muted-foreground ring-transparent",
} as const;

export function Ball({ value, tone = "pool", size = "default" }: BallProps) {
  return (
    <span
      id={`ball-${value}`}
      data-tone={tone}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono tabular-nums ring-1 transition-colors",
        size === "sm" ? "size-7 text-xs" : "size-9 text-sm",
        TONES[tone]
      )}
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}
