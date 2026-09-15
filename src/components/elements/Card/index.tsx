import { cn } from "@utils/css";
import type * as React from "react";

export function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-4xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-md ring-1 ring-foreground/5 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl",
        className
      )}
      {...props}
    />
  );
}

export { CardAction } from "@elements/Card/Action";
export { CardContent } from "@elements/Card/Content";
export { CardDescription } from "@elements/Card/Description";
export { CardFooter } from "@elements/Card/Footer";
export { CardHeader } from "@elements/Card/Header";
export { CardTitle } from "@elements/Card/Title";
