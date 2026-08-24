"use client";

import { motion } from "framer-motion";
import { BRANCHES, BRANCH_ORDER } from "@/lib/data/branches";
import { branchProgressPercent } from "@/lib/unlock";
import type { NodeStatus } from "@/lib/types";

export function TravelerCard({
  name,
  completed,
  branches,
  progress,
}: {
  name: string;
  completed: number;
  branches: number;
  progress: Record<string, NodeStatus>;
}) {
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
    : "TÚ";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-auto w-56 rounded-2xl border border-line bg-surface/90 p-4 shadow-xl backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-action to-cyan font-heading text-sm font-bold text-[#061827]">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {name || "Aspirante"}
          </p>
          <p className="text-[11px] text-muted">
            {completed} retos · {branches} ramas
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-1">
        {BRANCH_ORDER.map((id) => {
          const branch = BRANCHES[id];
          const pct = branchProgressPercent(progress, id);
          return (
            <span
              key={id}
              title={`${branch.shortName} · ${pct}%`}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised"
            >
              <span
                className="block h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: branch.color }}
              />
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
