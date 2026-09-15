import { cn } from "@utils/css";
import type * as React from "react";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export { TableBody } from "@elements/Table/Body";
export { TableCell } from "@elements/Table/Cell";
export { TableHead } from "@elements/Table/Head";
export { TableHeader } from "@elements/Table/Header";
export { TableRow } from "@elements/Table/Row";
