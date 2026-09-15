import { cn } from "@utils/css";

const DOTS = [
  [0, 0],
  [2, 0],
  [3, 0],
  [0, 1],
  [1, 1],
  [3, 1],
  [4, 1],
  [1, 2],
  [2, 2],
  [3, 2],
] as const;

const MUTED = [
  [1, 0],
  [4, 0],
  [2, 1],
  [0, 2],
  [4, 2],
] as const;

const cx = (col: number) => 4 + col * 13;
const cy = (row: number) => 4 + row * 13;

export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 34" role="img" aria-label="myLucky" className={cn("h-[15px] w-[26px]", className)}>
      {MUTED.map(([col, row]) => (
        <circle
          key={`m-${col}-${row}`}
          cx={cx(col)}
          cy={cy(row)}
          r={4}
          className="fill-muted-foreground/45"
        />
      ))}
      {DOTS.map(([col, row]) => (
        <circle key={`d-${col}-${row}`} cx={cx(col)} cy={cy(row)} r={4} fill="currentColor" />
      ))}
    </svg>
  );
}
