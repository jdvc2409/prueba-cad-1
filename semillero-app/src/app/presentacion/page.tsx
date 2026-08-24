"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";
import type { IntroItemType } from "@/lib/types";

const GUIDE_QUESTIONS = [
  "¿Quién eres?",
  "¿Qué cosas disfrutas hacer?",
  "¿Qué haces en tu tiempo libre?",
  "¿Qué te gusta construir, investigar o aprender?",
  "¿Has participado en algún proyecto del que te sientas orgulloso?",
  "¿Qué te llama la atención de la robótica?",
  "¿Qué te gustaría aprender dentro del semillero?",
  "¿Qué crees que podrías aportar?",
  "¿Prefieres diseñar, construir, programar, investigar o probar?",
  "¿Hay algo más que creas que deberíamos saber de ti?",
];

const TYPE_META: Record<IntroItemType, { label: string; icon: string }> = {
  text: { label: "Texto", icon: "T" },
  image: { label: "Imagen", icon: "🖼" },
  audio: { label: "Audio", icon: "♪" },
  video: { label: "Video", icon: "▶" },
  file: { label: "Archivo", icon: "📎" },
  link: { label: "Enlace", icon: "🔗" },
};

export default function PresentacionPage() {
  const { state, addIntroItem, removeIntroItem } = useAppState();
  const [composer, setComposer] = useState<"text" | "link" | null>(null);
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFileType = useRef<IntroItemType>("file");

  function openFilePicker(type: IntroItemType, accept: string) {
    pendingFileType.current = type;
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addIntroItem({ type: pendingFileType.current, title: file.name, content: url });
    e.target.value = "";
  }

  function submitText() {
    if (!draft.trim()) return;
    addIntroItem({ type: "text", title: "Nota", content: draft.trim() });
    setDraft("");
    setComposer(null);
  }

  function submitLink() {
    if (!draft.trim()) return;
    addIntroItem({ type: "link", title: draft.trim(), content: draft.trim() });
    setDraft("");
    setComposer(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileChosen}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-cyan">
          Paso 2 · Preséntate como quieras
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink">
          Antes de ver qué sabes hacer, queremos saber quién eres.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Combina texto, imágenes, audio, video, archivos o enlaces — el
          formato es tu decisión.
        </p>
      </motion.div>

      <details className="mt-6 rounded-xl border border-line bg-surface/50 p-4 text-sm text-muted open:pb-5">
        <summary className="cursor-pointer select-none font-medium text-ink">
          Preguntas guía (opcional, solo para inspirarte)
        </summary>
        <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {GUIDE_QUESTIONS.map((q) => (
            <li key={q} className="text-xs leading-relaxed text-muted">
              · {q}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setComposer(composer === "text" ? null : "text")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Escribir
        </button>
        <button
          onClick={() => openFilePicker("image", "image/*")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Subir imagen
        </button>
        <button
          onClick={() => openFilePicker("audio", "audio/*")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Subir audio
        </button>
        <button
          onClick={() => openFilePicker("video", "video/*")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Subir video
        </button>
        <button
          onClick={() => openFilePicker("file", "*/*")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Subir archivo
        </button>
        <button
          onClick={() => setComposer(composer === "link" ? null : "link")}
          className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-tech"
        >
          Agregar enlace
        </button>
      </div>

      <AnimatePresence>
        {composer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-line bg-surface/60 p-4">
              {composer === "text" ? (
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={4}
                  placeholder="Escribe lo que quieras contarnos…"
                  className="w-full resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-tech"
                />
              ) : (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="https://tuportafolio.com"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-tech"
                />
              )}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setComposer(null);
                    setDraft("");
                  }}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-muted hover:text-ink"
                >
                  Cancelar
                </button>
                <button
                  onClick={composer === "text" ? submitText : submitLink}
                  className="rounded-lg bg-tech px-4 py-2 text-xs font-semibold text-[#061827]"
                >
                  Agregar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        {state.introduction.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
            Aún no agregas ninguna evidencia. Elige un formato arriba para
            empezar.
          </p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {state.introduction.map((item) => {
                const meta = TYPE_META[item.type];
                return (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-sm">
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">
                        {item.type === "text" ? item.content : item.title}
                      </p>
                      <p className="text-[11px] text-muted">{meta.label}</p>
                    </div>
                    <button
                      onClick={() => removeIntroItem(item.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs text-muted hover:text-danger"
                    >
                      Eliminar
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="mt-10 flex justify-end">
        <Link
          href="/disponibilidad"
          className="rounded-lg bg-gradient-to-r from-action to-tech px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
