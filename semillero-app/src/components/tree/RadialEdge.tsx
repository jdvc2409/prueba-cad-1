"use client";

import { motion } from "framer-motion";
import type { EdgeProps } from "@xyflow/react";

export interface RadialEdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dimmed: boolean;
  [key: string]: unknown;
}

export function RadialEdge({ data }: EdgeProps) {
  const d = data as RadialEdgeData;
  if (!d) return null;

  const mx = (d.x1 + d.x2) / 2;
  const my = (d.y1 + d.y2) / 2;
  const path = `M ${d.x1} ${d.y1} Q ${mx} ${my} ${d.x2} ${d.y2}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={d.dimmed ? "rgba(117,186,224,0.15)" : "#35C4E8"}
      strokeWidth={2}
      strokeLinecap="round"
      opacity={d.dimmed ? 0.4 : 0.85}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: d.dimmed ? 0.4 : 0.85 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  );
}
