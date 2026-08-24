"use client";

import { motion } from "framer-motion";
import type { EdgeProps } from "@xyflow/react";

export interface LaneEdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  active: boolean;
  dimmed: boolean;
  variant: "lane" | "irfeed";
  [key: string]: unknown;
}

export function LaneEdge({ data }: EdgeProps) {
  const d = data as LaneEdgeData;
  if (!d) return null;

  const my = (d.y1 + d.y2) / 2;
  const path = `M ${d.x1} ${d.y1} C ${d.x1} ${my} ${d.x2} ${my} ${d.x2} ${d.y2}`;

  const stroke = d.active ? d.color : "rgba(117,186,224,0.28)";
  const width = d.variant === "irfeed" ? 1.75 : d.active ? 2 : 1.5;
  const dash = !d.active ? "5 5" : undefined;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
      opacity={d.dimmed ? 0.35 : d.active ? 0.85 : 0.5}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: d.dimmed ? 0.35 : d.active ? 0.85 : 0.5 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
  );
}
