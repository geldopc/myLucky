import { Badge } from "@elements/Badge";
import { Ball } from "@elements/Ball";
import { type Bands, computeFeatures, FEATURE_LABELS, type FeatureKey } from "@utils/stats";
import type { Wheel as WheelModel } from "@utils/wheel";
import { GameList } from "@widgets/Game";

const SHOWN: FeatureKey[] = ["even", "sum", "primes", "frame", "repeats"];

type WheelProps = {
  wheel: WheelModel;
  bands: Bands;
  previous?: number[];
  showLabel: boolean;
};

export function Wheel({ wheel, bands, previous, showLabel }: WheelProps) {
  const features = computeFeatures(wheel.pool, previous);

  return (
    <section id={`wheel-${wheel.set}`} className="flex flex-col gap-4">
      {showLabel ? (
        <h3 className="font-heading text-sm tracking-wide text-muted-foreground uppercase">
          Conjunto {wheel.set}
        </h3>
      ) : null}

      <ul className="flex flex-wrap gap-2">
        {wheel.pool.map((value) => (
          <li key={value}>
            <Ball value={value} tone="pool" />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        {SHOWN.map((key) => (
          <Badge key={key} variant="outline" className="font-mono">
            {FEATURE_LABELS[key]} {features[key]}
            <span className="text-muted-foreground">
              /{bands[key].min}–{bands[key].max}
            </span>
          </Badge>
        ))}
      </div>

      <GameList games={wheel.games} />
    </section>
  );
}
