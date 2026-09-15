import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

export function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

export { TooltipContent } from "@widgets/Tooltip/Content";
export { TooltipTrigger } from "@widgets/Tooltip/Trigger";
