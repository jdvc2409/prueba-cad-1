"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocalEvidenceUploader } from "@/components/challenges/LocalEvidenceUploader";
import type { LocalEvidenceFile } from "@/lib/challenges/evidenceStore";
import type { ChallengeAttempt, JsonValue, NodeChallengeProgress } from "@/lib/types";

const NODE_ID = "D0";
const STEP_ID = "submission";
const MIN_NOTE_LENGTH = 15;

interface QuickDraft {
  note: string;
  files: LocalEvidenceFile[];
}

interface Props {
  savedProgress?: NodeChallengeProgress;
  readOnly: boolean;
  onSave: (progress: NodeChallengeProgress) => void;
  onComplete: (finalProgress: NodeChallengeProgress) => void;
  onExit?: () => void;
}

export function QuickDeliveryChallenge({ savedProgress, readOnly, onSave, onComplete, onExit }: Props) {
  const initial = useMemo(() => createInitialProgress(savedProgress), [savedProgress]);
  const [progress, setProgress] = useState(initial);
  const [message, setMessage] = useState("");
  const progressRef = useRef(initial);
  const onSaveRef = useRef(onSave);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const commit = useCallback((draft: QuickDraft) => {
    const now = Date.now();
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: now,
      steps: {
        ...progressRef.current.steps,
        [STEP_ID]: { ...progressRef.current.steps[STEP_ID], draft: toJson(draft) },
      },
      analytics: { ...progressRef.current.analytics, lastEvent: "answer_changed" },
    };
    progressRef.current = next;
    setProgress(next);
    onSaveRef.current(next);
  }, []);

  const step = progress.steps[STEP_ID];
  const draft = normalizeDraft(step.draft);
  const solved = Boolean(step.solvedAt);

  function submit() {
    if (readOnly || solved) return;
    if (draft.note.trim().length < MIN_NOTE_LENGTH) {
      setMessage(`Escribe al menos ${MIN_NOTE_LENGTH} caracteres sobre el archivo.`);
      return;
    }
    if (draft.files.length === 0) {
      setMessage("Adjunta un archivo para registrar la entrega.");
      return;
    }
    const now = Date.now();
    const attempt: ChallengeAttempt = {
      id: crypto.randomUUID(),
      nodeId: NODE_ID,
      stepId: STEP_ID,
      attemptNumber: step.attempts.length + 1,
      startedAt: progress.startedAt,
      submittedAt: now,
      durationSeconds: step.totalActiveSeconds,
      answer: toJson(draft),
      isCorrect: null,
      hintsUsed: 0,
      metadata: { reviewerRequired: true, evidenceCount: draft.files.length },
    };
    const next: NodeChallengeProgress = {
      ...progress,
      updatedAt: now,
      completedAt: now,
      steps: { ...progress.steps, [STEP_ID]: { ...step, attempts: [...step.attempts, attempt], solvedAt: now } },
      analytics: { ...progress.analytics, lastEvent: "challenge_completed", reviewerRequired: true },
    };
    progressRef.current = next;
    setProgress(next);
    setMessage("Entrega registrada. El evaluador podrá consultar el archivo desde tu árbol.");
    onCompleteRef.current(next);
  }

  return (
    <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-surface/45 shadow-[0_24px_70px_rgba(0,0,0,.2)]">
      <header className="border-b border-line bg-[#0a2945] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-cyan">Diseño · D0 · Sin prerrequisitos</p>
            <h2 id="skill-detail-title" className="mt-2 font-heading text-2xl font-semibold text-ink sm:text-3xl">Entrega rápida</h2>
            <p id="skill-detail-description" className="mt-2 text-sm leading-6 text-muted">Sube algo que ya tengas: una imagen, PDF, documento, archivo de código o comprimido. No tiene que estar perfecto.</p>
          </div>
          <span className="rounded-full border border-ok/30 bg-ok/10 px-3 py-1.5 text-xs font-semibold text-ok">1–2 minutos</span>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-cyan/25 bg-cyan/[.06] p-5">
          <h3 className="text-base font-semibold text-ink">¿Qué puedes entregar?</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Una captura, boceto, informe, tarea anterior, fragmento de código o cualquier archivo que muestre algo que hayas creado o aprendido.</p>
        </div>

        <label className="mt-5 block rounded-2xl border border-line bg-night/25 p-4 sm:p-5">
          <span className="text-sm font-semibold text-ink">Cuéntanos qué representa</span>
          <span className="mt-1 block text-xs leading-5 text-muted">Una o dos frases son suficientes.</span>
          <textarea value={draft.note} onChange={(event) => { setMessage(""); commit({ ...draft, note: event.target.value }); }} disabled={readOnly || solved} maxLength={600} rows={4} placeholder="Por ejemplo: es un pequeño programa que hice para aprender a controlar un servomotor…" className="mt-3 w-full resize-y rounded-xl border border-line bg-night/45 p-3 text-sm leading-6 text-ink outline-none placeholder:text-muted/55 focus:border-cyan/50 disabled:opacity-70" />
          <span className="mt-1 block text-right text-[11px] tabular-nums text-muted">{draft.note.trim().length}/{MIN_NOTE_LENGTH} mínimo</span>
        </label>

        <div className="mt-5">
          <LocalEvidenceUploader nodeId={NODE_ID} fieldId="quick-delivery" label="Archivo de la entrega" description="Aceptamos imágenes, PDF, texto, código, documentos y archivos comprimidos." accept="image/*,application/pdf,text/*,.doc,.docx,.zip,.rar,.7z,.py,.js,.ts,.ino,.stl,.step" value={draft.files} onChange={(files) => { setMessage(""); commit({ ...draft, files }); }} disabled={readOnly || solved} required />
        </div>

        {message && <p role="status" className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${solved ? "border-ok/30 bg-ok/[.07] text-ok" : "border-cyan/25 bg-cyan/[.06] text-ice"}`}>{message}</p>}

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          {onExit && <button type="button" onClick={onExit} className="min-h-11 rounded-xl border border-line px-4 text-xs font-semibold text-muted transition-colors hover:border-cyan/35 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">Volver al árbol</button>}
          {!solved && !readOnly ? <button type="button" onClick={submit} className="min-h-11 rounded-xl bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-tech focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">Registrar entrega</button> : <span className="inline-flex min-h-11 items-center rounded-xl border border-ok/30 bg-ok/10 px-4 text-sm font-semibold text-ok">Entrega registrada</span>}
        </footer>
      </div>
    </article>
  );
}

function createInitialProgress(saved?: NodeChallengeProgress): NodeChallengeProgress {
  const now = Date.now();
  const valid = saved?.nodeId === NODE_ID ? saved : undefined;
  const savedStep = valid?.steps?.[STEP_ID];
  return {
    nodeId: NODE_ID,
    currentStepId: STEP_ID,
    shuffleSeed: valid?.shuffleSeed ?? now,
    startedAt: valid?.startedAt ?? now,
    updatedAt: valid?.updatedAt ?? now,
    completedAt: valid?.completedAt ?? null,
    steps: {
      [STEP_ID]: {
        draft: toJson(normalizeDraft(savedStep?.draft)),
        attempts: savedStep?.attempts ?? [],
        revealedHints: 0,
        totalActiveSeconds: savedStep?.totalActiveSeconds ?? 0,
        solvedAt: savedStep?.solvedAt ?? null,
      },
    },
    analytics: valid?.analytics ?? { lastEvent: "challenge_started", reviewerRequired: true },
  };
}

function normalizeDraft(value: JsonValue | undefined): QuickDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { note: "", files: [] };
  const record = value as Record<string, JsonValue>;
  return {
    note: typeof record.note === "string" ? record.note : "",
    files: Array.isArray(record.files) ? record.files.filter(isEvidenceFile).map((file) => file as unknown as LocalEvidenceFile) : [],
  };
}

function isEvidenceFile(value: JsonValue): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return typeof value.id === "string" && typeof value.name === "string" && typeof value.size === "number";
}

function toJson(value: QuickDraft): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}
