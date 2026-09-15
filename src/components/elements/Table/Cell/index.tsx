import { cn } from "@utils/css";
import type * as React from "react";

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-2 py-3 align-middle whitespace-nowrap sm:px-3", className)}
      {...props}
    />
  );
}
