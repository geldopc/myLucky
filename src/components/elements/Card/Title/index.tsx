import { cn } from "@utils/css";
import type * as React from "react";

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-title" className={cn("font-heading text-base font-medium", className)} {...props} />
  );
}
