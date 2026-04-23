"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

/** Recharts wrapper with fixed height so ResponsiveContainer measures correctly (shadcn chart pattern). */
export function ChartContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  return (
    <div
      className={cn(
        "relative h-[260px] min-h-0 w-full min-w-0 max-w-full text-[11px] [&_.recharts-cartesian-axis-tick_text]:fill-(--muted) [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-(--border)/40 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-(--border-strong) [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-(--border) [&_.recharts-radial-bar-background-sector]:fill-(--surface-soft) [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-(--surface) [&_.recharts-reference-line_[stroke='#ccc']]:stroke-(--border) [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className,
      )}
      {...props}
    >
      {/*
        Recharts defaults initialDimension to {-1,-1}, which logs console warnings on the first paint
        before ResizeObserver runs. Seed with positive placeholder sizes; observer corrects immediately.
      */}
      <RechartsPrimitive.ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        debounce={50}
        initialDimension={{ width: 320, height: 260 }}
      >
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;
