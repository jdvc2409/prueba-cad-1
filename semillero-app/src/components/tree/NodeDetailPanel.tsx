"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES } from "@/lib/data/branches";
import { BranchIcon } from "@/components/icons/BranchIcon";
import type { NodeStatus, SkillNodeDef } from "@/lib/types";

export function NodeDetailPanel({
  node,
  status,
  prereqTitles,
  onClose,
  onComplete,
}: {
  node: SkillNodeDef | null;
  status: NodeStatus;
  prereqTitles: string[];
  onClose: () => void;
  onComplete: (id: string) => void;
}) {
  const branch = node ? BRANCHES[node.branchId] : null;

  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-line bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: `${branch?.color}22`,
                  color: branch?.color,
                }}
              >
                {branch && <BranchIcon branch={branch.id} className="h-5 w-5" />}
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted hover:text-ink"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-5 text-[11px] uppercase tracking-widest text-cyan">
              {branch?.name} · {node.typeLabel}
            </p>
            <h2 className="mt-1.5 font-heading text-xl font-semibold text-ink">
              {node.title}
            </h2>

            <span
              className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
                status === "completed"
                  ? "bg-ok/15 text-ok"
                  : status === "available"
                  ? "bg-cyan/15 text-cyan"
                  : "bg-surface-raised text-muted"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {status === "completed"
                ? "Completado"
                : status === "available"
                ? "Disponible"
                : "Bloqueado"}
            </span>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              {node.description}
            </p>

            {status === "locked" && prereqTitles.length > 0 && (
              <p className="mt-4 rounded-lg border border-line bg-surface-raised/60 px-3.5 py-2.5 text-xs text-muted">
                Se desbloquea al completar: {prereqTitles.join(" o ")}.
              </p>
            )}

            <div className="mt-auto pt-6">
              {status === "available" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onComplete(node.id)}
                  className="w-full rounded-lg bg-gradient-to-r from-action to-tech py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20"
                >
                  Completar reto
                </motion.button>
              )}
              {status === "completed" && (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-ok/30 bg-ok/10 py-3 text-sm font-medium text-ok">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Reto completado
                </div>
              )}
              {status === "locked" && (
                <div className="rounded-lg border border-line py-3 text-center text-sm text-muted">
                  Todavía no disponible
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
