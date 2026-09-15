import type { Bands } from "@utils/stats";
import { resolveActiveSet, type Wheel as WheelModel } from "@utils/wheel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@widgets/Tabs";
import { Wheel } from "@widgets/Wheel";
import * as React from "react";

type WheelsProps = {
  wheels: WheelModel[];
  bands: Bands;
  previous?: number[];
};

export function Wheels({ wheels, bands, previous }: WheelsProps) {
  const [active, setActive] = React.useState(1);
  const current = resolveActiveSet(wheels, active);

  if (wheels.length === 0) return null;

  if (wheels.length === 1) {
    return <Wheel wheel={wheels[0]} bands={bands} previous={previous} showLabel={false} />;
  }

  return (
    <Tabs id="wheels" value={current} onValueChange={(value) => setActive(Number(value))} className="gap-6">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList aria-label="Conjuntos gerados">
          {wheels.map((wheel) => (
            <TabsTrigger key={wheel.set} value={wheel.set} id={`wheel-tab-${wheel.set}`}>
              Conjunto {wheel.set}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {wheels.map((wheel) => (
        <TabsContent key={wheel.set} value={wheel.set}>
          <Wheel wheel={wheel} bands={bands} previous={previous} showLabel={false} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
