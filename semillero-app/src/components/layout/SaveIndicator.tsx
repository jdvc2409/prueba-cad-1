"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";

export function SaveIndicator() {
  const { saveStatus } = useAppState();

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <AnimatePresence mode="wait">
        {saveStatus === "saving" && (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            Guardando…
          </motion.span>
        )}
        {saveStatus === "saved" && (
          <motion.span
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            Guardado
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
