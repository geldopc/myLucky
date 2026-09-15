import { cn } from "@utils/css";
import type * as React from "react";

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle text-xs font-normal tracking-wide whitespace-nowrap text-muted-foreground uppercase sm:px-3",
        className
      )}
      {...props}
    />
  );
}
