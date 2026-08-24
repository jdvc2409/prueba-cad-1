"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";
import { EASE_OUT } from "@/lib/motion";
import type { IntroItemType } from "@/lib/types";

const STEPS = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Preséntate" },
] as const;

export default function RegistroPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-cyan">
          Antes del árbol
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink">
          Cuéntanos quién eres.
        </h1>
        <p className="mt-3 text-sm text-muted">
          Dos pasos cortos y pasas directo al árbol de habilidades.
        </p>
      </motion.div>

      <Stepper current={step} onJump={setStep} />

      <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepShell key="1">
              <StepDatos onNext={() => setStep(2)} />
            </StepShell>
          )}
          {step === 2 && (
            <StepShell key="2">
              <StepPresentacion
                onBack={() => setStep(1)}
                onNext={() => router.push("/skills")}
              />
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function Stepper({
  current,
  onJump,
}: {
  current: 1 | 2;
  onJump: (step: 1 | 2) => void;
}) {
  return (
    <div className="mt-8 flex items-center">
      {STEPS.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <button
              onClick={() => s.id < current && onJump(s.id)}
              disabled={s.id > current}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                active ? "text-ink" : done ? "text-cyan" : "text-muted"
              } ${s.id < current ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                  active
                    ? "border-cyan bg-cyan/15 text-cyan"
                    : done
                    ? "border-cyan bg-cyan text-[#061827]"
                    : "border-line text-muted"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  s.id
                )}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 transition-colors ${
                  done ? "bg-cyan" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted">
        {label}
        {optional && (
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] text-muted">
            opcional
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-tech";

const primaryBtn =
  "rounded-lg bg-gradient-to-r from-action to-tech px-6 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-action/20 transition-transform hover:scale-[1.02] active:scale-[0.98]";
const disabledBtn = "rounded-lg bg-surface-raised px-6 py-2.5 text-sm font-semibold text-muted";
const ghostBtn = "rounded-lg px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-ink";

function StepDatos({ onNext }: { onNext: () => void }) {
  const { state, updateProfile } = useAppState();
  const p = state.profile;

  const canContinue =
    p.fullName.trim() &&
    p.email.trim() &&
    p.program.trim() &&
    p.semester.trim() &&
    p.consentData &&
    p.consentFiles;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre completo">
          <input
            className={inputClass}
            value={p.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field label="Correo electrónico">
          <input
            type="email"
            className={inputClass}
            value={p.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
            placeholder="tucorreo@universidad.edu"
          />
        </Field>
        <Field label="Programa / carrera">
          <input
            className={inputClass}
            value={p.program}
            onChange={(e) => updateProfile({ program: e.target.value })}
            placeholder="Ingeniería Mecatrónica"
          />
        </Field>
        <Field label="Semestre">
          <input
            className={inputClass}
            value={p.semester}
            onChange={(e) => updateProfile({ semester: e.target.value })}
            placeholder="5"
          />
        </Field>
        <Field label="Código o identificador institucional" optional>
          <input
            className={inputClass}
            value={p.studentCode}
            onChange={(e) => updateProfile({ studentCode: e.target.value })}
            placeholder="20231234"
          />
        </Field>
      </div>

      <div className="my-7 h-px bg-line" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="GitHub" optional>
          <input
            className={inputClass}
            value={p.github}
            onChange={(e) => updateProfile({ github: e.target.value })}
            placeholder="github.com/usuario"
          />
        </Field>
        <Field label="LinkedIn" optional>
          <input
            className={inputClass}
            value={p.linkedin}
            onChange={(e) => updateProfile({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/usuario"
          />
        </Field>
        <Field label="Portafolio" optional>
          <input
            className={inputClass}
            value={p.portfolio}
            onChange={(e) => updateProfile({ portfolio: e.target.value })}
            placeholder="miportafolio.com"
          />
        </Field>
        <Field label="Página personal / Instagram" optional>
          <input
            className={inputClass}
            value={p.website}
            onChange={(e) => updateProfile({ website: e.target.value })}
            placeholder="instagram.com/usuario"
          />
        </Field>
      </div>

      <div className="my-7 h-px bg-line" />

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3 text-xs text-muted">
          <input
            type="checkbox"
            checked={p.consentData}
            onChange={(e) => updateProfile({ consentData: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-tech"
          />
          Acepto el tratamiento de mis datos personales para el proceso de
          selección del semillero.
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-xs text-muted">
          <input
            type="checkbox"
            checked={p.consentFiles}
            onChange={(e) => updateProfile({ consentFiles: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-tech"
          />
          Acepto que los archivos que envíe sean utilizados con fines del
          proceso de selección.
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={onNext} disabled={!canContinue} className={canContinue ? primaryBtn : disabledBtn}>
          Continuar
        </button>
      </div>
    </div>
  );
}

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

function StepPresentacion({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
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
    <div>
      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChosen} />

      <p className="text-sm text-ink">
        Antes de ver qué sabes hacer, queremos saber quién eres. Combina
        texto, imágenes, audio, video, archivos o enlaces — el formato es tu
        decisión.
      </p>

      <details className="mt-5 rounded-xl border border-line bg-surface-raised/50 p-4 text-sm text-muted open:pb-5">
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

      <div className="mt-5 flex flex-wrap gap-2">
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
            <div className="mt-4 rounded-xl border border-line bg-surface-raised/50 p-4">
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

      <div className="mt-6">
        {state.introduction.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
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
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface-raised/40 px-4 py-3"
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

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className={ghostBtn}>
          Atrás
        </button>
        <button onClick={onNext} className={primaryBtn}>
          Explorar mi árbol
        </button>
      </div>
    </div>
  );
}
