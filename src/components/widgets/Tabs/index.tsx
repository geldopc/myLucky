import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@utils/css";

export function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props}
    />
  );
}

export { TabsContent } from "@widgets/Tabs/Content";
export { TabsList } from "@widgets/Tabs/List";
export { TabsTrigger } from "@widgets/Tabs/Trigger";
