"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { EASE_SPRING } from "@/lib/motion";
import type { NodeStatus, SkillNodeDef } from "@/lib/types";
import { BranchIcon } from "@/components/icons/BranchIcon";

export interface SkillNodeData {
  def: SkillNodeDef;
  status: NodeStatus;
  dimmed: boolean;
  color: string;
  isIR?: boolean;
  onOpen: (id: string) => void;
  [key: string]: unknown;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#061827" strokeWidth="3">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SkillNodeCard({ data }: NodeProps) {
  const d = data as SkillNodeData;
  const { def, status, dimmed, color, isIR } = d;
  const [hover, setHover] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const prevStatus = useRef(status);

  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;
    if (prev === "locked" && status === "available") {
      setJustUnlocked(true);
      const t = setTimeout(() => setJustUnlocked(false), 900);
      return () => clearTimeout(t);
    }
    if (prev === "available" && status === "completed") {
      setJustCompleted(true);
      const t = setTimeout(() => setJustCompleted(false), 500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const bodyClass =
    status === "completed"
      ? "border-ice/70 bg-gradient-to-br from-tech to-cyan"
      : status === "available"
      ? "border-2"
      : "border-dashed border border-line bg-surface/55";

  const bodyStyle: React.CSSProperties =
    status === "available"
      ? {
          borderColor: color,
          background: `linear-gradient(135deg, #0E2C44, ${color}26)`,
          boxShadow: `0 0 0 3px ${color}22`,
        }
      : {};

  if (isIR) {
    bodyStyle.boxShadow = bodyStyle.boxShadow
      ? `${bodyStyle.boxShadow}, 0 0 0 1px rgba(221,244,255,0.35)`
      : "0 0 0 1px rgba(221,244,255,0.35)";
  }

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
          className="pointer-events-none absolute -top-2 z-20 w-44 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 text-left shadow-xl"
          style={{ left: "50%" }}
        >
          <p className="text-xs font-semibold text-ink">{def.title}</p>
          <p className="mt-1 text-[10px] text-muted">
            {status === "completed" ? "Completado" : status === "available" ? "Disponible — clic para ver el reto" : "Bloqueado"}
          </p>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={() => d.onOpen(def.id)}
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{
          opacity: dimmed ? 0.4 : 1,
          scale: justCompleted ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 0.32, ease: EASE_SPRING }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        style={{ width: isIR ? 208 : 152, ...bodyStyle }}
        className={`relative flex cursor-pointer flex-col gap-1.5 rounded-2xl px-2.5 py-2 text-left shadow-md transition-shadow ${bodyClass} ${
          dimmed ? "grayscale" : ""
        } ${justUnlocked ? "ring-pulse" : ""}`}
      >
        {isIR && (
          <p className="text-[8.5px] font-semibold uppercase tracking-wider text-ice">
            Reto transversal
          </p>
        )}
        <div className="flex items-start gap-1.5">
          <span
            className={`flex shrink-0 items-center justify-center rounded-[7px] ${isIR ? "h-7 w-7" : "h-[22px] w-[22px]"}`}
            style={{
              background: status === "completed" ? "rgba(6,24,39,0.18)" : `${color}26`,
              color: status === "locked" ? "#9CB6C8" : status === "completed" ? "#061827" : color,
            }}
          >
            <BranchIcon branch={def.branchId} className={isIR ? "h-4 w-4" : "h-3 w-3"} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={`line-clamp-2 font-semibold ${isIR ? "text-[13px] leading-[16px]" : "text-[11px] leading-[14px]"}`}
              style={{ color: status === "completed" ? "#061827" : status === "locked" ? "#9CB6C8" : "#F5FAFD" }}
            >
              {def.title}
            </p>
          </div>
        </div>
        <p
          className="truncate text-[8.5px] font-medium uppercase tracking-wider"
          style={{ color: status === "completed" ? "rgba(6,24,39,0.65)" : "#9CB6C8" }}
        >
          {def.typeLabel}
        </p>

        <span
          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2"
          style={{
            borderColor: "#061827",
            background:
              status === "completed" ? "#58C7A2" : status === "available" ? color : "#0B2438",
          }}
        >
          {status === "completed" && <CheckIcon />}
          {status === "locked" && <LockIcon />}
          {status === "available" && <span className="h-1.5 w-1.5 rounded-full bg-[#061827]/40" />}
        </span>
      </motion.button>
    </div>
  );
}
