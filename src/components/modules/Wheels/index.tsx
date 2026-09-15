import type { Bands } from "@utils/stats";
import type { Wheel as WheelModel } from "@utils/wheel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@widgets/Tabs";
import { Wheel } from "@widgets/Wheel";

type WheelsProps = {
  wheels: WheelModel[];
  bands: Bands;
  previous?: number[];
  spinning?: boolean;
  active: number;
  onActiveChange: (set: number) => void;
};

export function Wheels({ wheels, bands, previous, spinning = false, active, onActiveChange }: WheelsProps) {
  if (wheels.length === 0) return null;

  if (wheels.length === 1) {
    return (
      <Wheel wheel={wheels[0]} bands={bands} previous={previous} showLabel={false} spinning={spinning} />
    );
  }

  return (
    <Tabs
      id="wheels"
      value={active}
      onValueChange={(value) => onActiveChange(Number(value))}
      className="gap-6"
    >
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList aria-label="Suas sequências da sorte">
          {wheels.map((wheel) => (
            <TabsTrigger key={wheel.set} value={wheel.set} id={`wheel-tab-${wheel.set}`}>
              Sorte {wheel.set}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {wheels.map((wheel) => (
        <TabsContent key={wheel.set} value={wheel.set}>
          <Wheel wheel={wheel} bands={bands} previous={previous} showLabel={false} spinning={spinning} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
