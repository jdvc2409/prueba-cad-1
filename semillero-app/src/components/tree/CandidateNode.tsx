"use client";

import { motion } from "framer-motion";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface CandidateNodeData {
  name: string;
  completed: number;
  branches: number;
  ready: boolean;
  [key: string]: unknown;
}

export function CandidateNode({ data }: NodeProps) {
  const d = data as CandidateNodeData;
  const initials = d.name
    ? d.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
    : "TÚ";

  return (
    <>
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex w-40 flex-col items-center rounded-2xl border bg-surface/90 px-4 py-5 text-center shadow-xl backdrop-blur ${
          d.ready ? "border-cyan pulse-glow" : "border-line"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-action to-cyan font-heading text-lg font-bold text-[#061827]">
          {initials}
        </span>
        <p className="mt-3 truncate text-xs font-semibold text-ink w-full">
          {d.name || "Comienza tu recorrido"}
        </p>
        {(d.completed > 0 || d.branches > 0) && (
          <p className="mt-1 text-[11px] text-muted">
            {d.completed} retos · {d.branches} ramas
          </p>
        )}
      </motion.div>
    </>
  );
}
