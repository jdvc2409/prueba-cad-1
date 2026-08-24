"use client";

import { motion } from "framer-motion";
import { BRANCHES, BRANCH_ORDER } from "@/lib/data/branches";
import { BranchIcon } from "@/components/icons/BranchIcon";
import { branchProgressPercent, branchCompletedCount } from "@/lib/unlock";
import { SKILL_NODES } from "@/lib/data/nodes";
import type { BranchId, NodeStatus } from "@/lib/types";

export function TreeHeader({
  progress,
  overview,
  onToggleOverview,
  onJumpToLane,
  completedTotal,
  branchesTotal,
}: {
  progress: Record<string, NodeStatus>;
  overview: boolean;
  onToggleOverview: () => void;
  onJumpToLane: (id: BranchId) => void;
  completedTotal: number;
  branchesTotal: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-xl backdrop-blur"
    >
      <div>
        <h1 className="font-heading text-sm font-semibold text-ink">
          Árbol de habilidades
        </h1>
        <p className="text-[11px] text-muted">
          Siete rutas · completa un reto y desbloqueas el siguiente ·{" "}
          {completedTotal} completados, {branchesTotal} ramas exploradas
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {BRANCH_ORDER.map((id) => {
          const branch = BRANCHES[id];
          const total = SKILL_NODES.filter((n) => n.branchId === id).length;
          const done = branchCompletedCount(progress, id);
          const pct = branchProgressPercent(progress, id);
          return (
            <button
              key={id}
              onClick={() => onJumpToLane(id)}
              title={`Ir a ${branch.name}`}
              className="group flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1.5 text-[10px] text-muted transition-colors hover:border-tech hover:text-ink"
              style={{ borderLeftColor: branch.color, borderLeftWidth: 3 }}
            >
              <BranchIcon branch={id} className="h-3 w-3" style={{ color: branch.color }} />
              <span className="hidden sm:inline">{branch.shortName}</span>
              <span className="font-semibold text-ink/80">
                {done}/{total}
              </span>
              <span className="sr-only">{pct}%</span>
            </button>
          );
        })}

        <button
          onClick={onToggleOverview}
          className="ml-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-tech"
        >
          {overview ? "Ver mi progreso" : "Ver árbol completo"}
        </button>
      </div>
    </motion.div>
  );
}
