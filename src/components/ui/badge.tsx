import * as React from "react";

import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "blue" | "green" | "yellow" | "red" | "purple";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "blue" &&
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        tone === "green" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        tone === "yellow" &&
          "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        tone === "red" &&
          "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
        tone === "purple" &&
          "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        className
      )}
      {...props}
    />
  );
}
