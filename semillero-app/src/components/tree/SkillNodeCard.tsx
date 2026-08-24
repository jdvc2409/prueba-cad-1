"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeStatus, SkillNodeDef } from "@/lib/types";

export interface SkillNodeData {
  def: SkillNodeDef;
  status: NodeStatus;
  dimmed: boolean;
  color: string;
  isIR: boolean;
  onOpen: (id: string) => void;
  [key: string]: unknown;
}

export function SkillNodeCard({ data }: NodeProps) {
  const d = data as SkillNodeData;
  const [hover, setHover] = useState(false);
  const { def, status, dimmed, color, isIR } = d;

  const size = isIR ? "h-20 w-20" : "h-16 w-16";
  const shape = isIR ? "" : "rounded-2xl";

  const statusStyles =
    status === "completed"
      ? { background: "linear-gradient(135deg,#168DD0,#35C4E8)", borderColor: "#DDF4FF" }
      : status === "available"
      ? { background: "linear-gradient(135deg,#0E2C44,#12395A)", borderColor: color }
      : { background: "#0B2438", borderColor: "rgba(117,186,224,0.18)" };

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute -top-2 z-20 w-48 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 text-left shadow-xl"
        >
          <p className="text-xs font-semibold text-ink">{def.title}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-cyan">
            {def.typeLabel}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            {status === "completed"
              ? "Completado"
              : status === "available"
              ? "Disponible"
              : "Bloqueado"}
          </p>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={() => !dimmed && d.onOpen(def.id)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={dimmed ? undefined : { scale: 1.08 }}
        whileTap={dimmed ? undefined : { scale: 0.96 }}
        style={statusStyles}
        className={`${size} ${shape} flex items-center justify-center border-2 text-xs font-bold shadow-lg transition-shadow ${
          dimmed
            ? "grayscale cursor-not-allowed"
            : status === "available"
            ? "pulse-glow cursor-pointer"
            : "cursor-pointer"
        } ${isIR ? "[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" : ""}`}
      >
        {status === "completed" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#061827" strokeWidth="3" className="h-6 w-6">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className={status === "locked" ? "text-muted" : "text-ink"}>
            {def.id}
          </span>
        )}
      </motion.button>

      {!isIR && (
        <p className="mt-1.5 max-w-[88px] truncate text-center text-[10px] text-muted">
          {def.title}
        </p>
      )}
      {isIR && (
        <p className="mt-1.5 text-center text-[10px] font-semibold text-cyan">
          {def.title}
        </p>
      )}
    </div>
  );
}
