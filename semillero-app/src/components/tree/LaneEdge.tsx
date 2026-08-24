"use client";

import { motion } from "framer-motion";
import { getBezierPath, type EdgeProps } from "@xyflow/react";

export type LaneEdgeVariant = "branch" | "lane" | "hybrid" | "irfeed";

export interface LaneEdgeData {
  color: string;
  active: boolean;
  dimmed: boolean;
  variant: LaneEdgeVariant;
  [key: string]: unknown;
}

export function LaneEdge({
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerStart,
  markerEnd,
  selected,
  style,
}: EdgeProps) {
  if (!data) return null;

  const d = data as LaneEdgeData;
  const variant = d.variant ?? "lane";
  const curvature =
    variant === "hybrid"
      ? 0.42
      : variant === "branch"
        ? 0.34
        : variant === "irfeed"
          ? 0.38
          : 0.28;
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature,
  });

  const stroke = d.active ? d.color : "rgba(117, 186, 224, 0.3)";
  const strokeWidth =
    variant === "branch"
      ? d.active
        ? 2.75
        : 2
      : variant === "hybrid"
        ? 1.2
        : variant === "irfeed"
          ? 1.55
          : d.active
            ? 2
            : 1.45;
  const strokeDasharray =
    variant === "hybrid"
      ? "2 7"
      : variant === "irfeed"
        ? "6 6"
        : !d.active
          ? "4 6"
          : undefined;
  const baseOpacity =
    variant === "hybrid"
      ? d.active
        ? 0.38
        : 0.24
      : variant === "irfeed"
        ? d.active
          ? 0.62
          : 0.34
        : variant === "branch"
          ? d.active
            ? 0.9
            : 0.48
          : d.active
            ? 0.78
            : 0.46;
  const opacity = d.dimmed
    ? Math.min(baseOpacity, 0.18)
    : selected
      ? Math.min(baseOpacity + 0.15, 1)
      : baseOpacity;

  return (
    <motion.path
      className="react-flow__edge-path"
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinecap="round"
      markerStart={markerStart}
      markerEnd={markerEnd}
      vectorEffect="non-scaling-stroke"
      style={style}
      aria-hidden="true"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration: variant === "hybrid" ? 0.45 : 0.6, ease: "easeOut" }}
    />
  );
}
