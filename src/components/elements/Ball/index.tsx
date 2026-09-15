import { cn } from "@utils/css";

type BallProps = {
  value: number;
  tone?: "pool" | "extra" | "muted";
  size?: "default" | "sm";
  spinning?: boolean;
  justSettled?: boolean;
};

const TONES = {
  pool: "bg-foreground text-background ring-foreground",
  extra: "bg-background text-foreground ring-foreground",
  muted: "bg-muted text-muted-foreground ring-transparent",
} as const;

export function Ball({
  value,
  tone = "pool",
  size = "default",
  spinning = false,
  justSettled = false,
}: BallProps) {
  return (
    <span
      id={`ball-${value}`}
      data-tone={tone}
      data-spinning={spinning || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono tabular-nums ring-1 transition-colors",
        size === "sm" ? "size-7 text-xs" : "size-9 text-sm",
        TONES[tone],
        spinning && "opacity-50 blur-[1px]",
        justSettled && "animate-ball-settle"
      )}
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}
