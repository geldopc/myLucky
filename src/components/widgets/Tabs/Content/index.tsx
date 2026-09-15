import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@utils/css";

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}
