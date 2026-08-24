"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES } from "@/lib/data/branches";
import { BranchIcon } from "@/components/icons/BranchIcon";
import type { NodeStatus, SkillNodeDef } from "@/lib/types";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!node) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [node, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {node && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar detalle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-default bg-[#020b12]/70 backdrop-blur-[3px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-detail-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-[#081f32] shadow-2xl shadow-black/50"
          >
            <div
              className="h-1 w-full shrink-0"
              style={{ background: `linear-gradient(90deg, ${BRANCHES[node.branchId].color}, #35C4E8)` }}
            />

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                      background: `${BRANCHES[node.branchId].color}18`,
                      borderColor: `${BRANCHES[node.branchId].color}3d`,
                      color: BRANCHES[node.branchId].color,
                    }}
                  >
                    <BranchIcon branch={node.branchId} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
                      {BRANCHES[node.branchId].name}
                    </p>
                    <p className="mt-1 text-xs text-muted">{node.typeLabel}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-transparent p-2 text-muted transition-colors hover:border-line hover:bg-surface-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-cyan"
                  aria-label="Cerrar"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <h2 id="skill-detail-title" className="mt-7 font-heading text-2xl font-semibold leading-tight text-ink">
                {node.title}
              </h2>

              <span
                className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                  status === "completed"
                    ? "border-ok/35 bg-ok/10 text-ok"
                    : status === "available"
                      ? "border-cyan/35 bg-cyan/10 text-cyan"
                      : "border-line bg-surface-raised/70 text-muted"
                }`}
              >
                {status === "completed" ? (
                  <CheckIcon />
                ) : status === "available" ? (
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_rgba(53,196,232,0.75)]" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                  </svg>
                )}
                {status === "completed"
                  ? "Reto completado"
                  : status === "available"
                    ? "Listo para explorar"
                    : "Aún bloqueado"}
              </span>

              <p className="mt-7 text-sm leading-7 text-muted">{node.description}</p>

              {status === "locked" && prereqTitles.length > 0 && (
                <div className="mt-6 rounded-xl border border-line bg-surface-raised/55 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
                    Ruta para desbloquearlo
                  </p>
                  <ul className="mt-3 space-y-2">
                    {prereqTitles.map((title) => (
                      <li key={title} className="flex gap-2 text-xs leading-relaxed text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/70" />
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-8">
                {status === "available" && (
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onComplete(node.id)}
                    className="w-full rounded-xl bg-gradient-to-r from-action to-tech px-5 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-action/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  >
                    Marcar reto como completado
                  </motion.button>
                )}
                {status === "completed" && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-ok/30 bg-ok/10 py-3.5 text-sm font-medium text-ok">
                    <CheckIcon />
                    Este reto ya hace parte de tu recorrido
                  </div>
                )}
                {status === "locked" && (
                  <div className="rounded-xl border border-line bg-surface/55 px-4 py-3.5 text-center text-sm text-muted">
                    Completa uno de sus prerrequisitos para continuar
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
