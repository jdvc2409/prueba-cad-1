"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  E3B_CAUSE_OPTIONS,
  E3B_CHALLENGE,
  E3B_CORRECTION_OPTIONS,
  E3B_MEASUREMENTS,
  createE3BDraft,
  evaluateE3B,
  type E3BEvaluation,
  type E3BSubmission,
} from "@/lib/challenges/electronics/e3b";
import type {
  ChallengeAttempt,
  ChallengeStepProgress,
  JsonValue,
  NodeChallengeProgress,
} from "@/lib/types";

export interface E3BChallengeProps {
  savedProgress?: NodeChallengeProgress;
  readOnly: boolean;
  onSave: (progress: NodeChallengeProgress) => void;
  onComplete: (finalProgress: NodeChallengeProgress) => void;
}

const STEP_ID = "hardware-diagnosis";
const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function E3BChallenge({
  savedProgress,
  readOnly,
  onSave,
  onComplete,
}: E3BChallengeProps) {
  const initial = useMemo(() => createInitialProgress(savedProgress), [savedProgress]);
  const [progress, setProgress] = useState(initial);
  const [evaluation, setEvaluation] = useState<E3BEvaluation | null>(() => {
    const last = initial.steps[STEP_ID].attempts.at(-1);
    return last ? evaluateE3B(normalizeDraft(last.answer)) : null;
  });
  const [labTab, setLabTab] = useState<"observations" | "measurements">("observations");
  const [announcement, setAnnouncement] = useState("");
  const progressRef = useRef(initial);
  const onSaveRef = useRef(onSave);
  const onCompleteRef = useRef(onComplete);
  const startedAtRef = useRef<number | null>(null);
  const completionNotifiedRef = useRef(Boolean(initial.completedAt));

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const commit = useCallback(
    (mutate: (current: NodeChallengeProgress) => NodeChallengeProgress) => {
      const next = mutate(progressRef.current);
      progressRef.current = next;
      setProgress(next);
      onSaveRef.current(next);
      return next;
    },
    []
  );

  const checkpoint = useCallback((eventName: string, updateView = true) => {
    const now = Date.now();
    const elapsed = startedAtRef.current === null
      ? 0
      : Math.max(0, Math.floor((now - startedAtRef.current) / 1_000));
    if (startedAtRef.current !== null) startedAtRef.current = now;
    const current = progressRef.current;
    const next: NodeChallengeProgress = {
      ...current,
      updatedAt: now,
      steps: {
        ...current.steps,
        [STEP_ID]: {
          ...current.steps[STEP_ID],
          totalActiveSeconds:
            current.steps[STEP_ID].totalActiveSeconds + elapsed,
        },
      },
      analytics: { ...current.analytics, lastEvent: eventName },
    };
    progressRef.current = next;
    if (updateView) setProgress(next);
    onSaveRef.current(next);
  }, []);

  useEffect(() => {
    if (readOnly || progress.completedAt) return;
    if (document.visibilityState === "visible") startedAtRef.current = Date.now();
    onSaveRef.current(progressRef.current);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        checkpoint("visibility_hidden");
        startedAtRef.current = null;
      } else {
        startedAtRef.current = Date.now();
      }
    };
    const onPageHide = () => checkpoint("page_hidden", false);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      checkpoint("challenge_closed", false);
      startedAtRef.current = null;
    };
  }, [checkpoint, progress.completedAt, readOnly]);

  const stepProgress = progress.steps[STEP_ID];
  const draft = normalizeDraft(stepProgress.draft);
  const solved = hasSolved(stepProgress);
  const minimumCharacters =
    E3B_CHALLENGE.steps[STEP_ID].minimumExplanationCharacters;
  const draftReady = Boolean(
    draft.causeOptionId &&
      draft.correctionOptionId &&
      draft.explanation.trim().length >= minimumCharacters
  );

  const changeDraft = (patch: Partial<E3BSubmission>) => {
    if (readOnly || solved) return;
    setEvaluation(null);
    const nextDraft: E3BSubmission = { ...draft, ...patch, stepId: STEP_ID };
    commit((current) => ({
      ...current,
      updatedAt: Date.now(),
      steps: {
        ...current.steps,
        [STEP_ID]: { ...current.steps[STEP_ID], draft: toJson(nextDraft) },
      },
      analytics: { ...current.analytics, lastEvent: "answer_changed" },
    }));
  };

  const revealHint = () => {
    if (readOnly || solved || stepProgress.revealedHints > 0) return;
    commit((current) => ({
      ...current,
      updatedAt: Date.now(),
      steps: {
        ...current.steps,
        [STEP_ID]: { ...current.steps[STEP_ID], revealedHints: 1 },
      },
      analytics: { ...current.analytics, lastEvent: "hint_opened" },
    }));
    setAnnouncement("Pista disponible debajo del diagnóstico.");
  };

  const submit = () => {
    if (readOnly || solved || !draftReady) {
      setAnnouncement("Completa la causa, la corrección y la explicación antes de comprobar.");
      return;
    }
    const result = evaluateE3B(draft);
    const now = Date.now();
    const attempt: ChallengeAttempt = {
      id: crypto.randomUUID(),
      nodeId: "E3B",
      stepId: STEP_ID,
      attemptNumber: stepProgress.attempts.length + 1,
      startedAt: Math.max(progress.startedAt, now - stepProgress.totalActiveSeconds * 1_000),
      submittedAt: now,
      durationSeconds: stepProgress.totalActiveSeconds,
      answer: toJson(draft),
      isCorrect: result.isComplete,
      hintsUsed: stepProgress.revealedHints,
      score: result.score,
      metadata: { maxScore: result.maxScore, reviewerRequired: true },
    };
    setEvaluation(result);
    const next = commit((current) => ({
      ...current,
      updatedAt: now,
      completedAt: result.isComplete ? current.completedAt ?? now : null,
      steps: {
        ...current.steps,
        [STEP_ID]: {
          ...current.steps[STEP_ID],
          attempts: [...current.steps[STEP_ID].attempts, attempt],
          solvedAt: result.isComplete ? now : null,
        },
      },
      analytics: {
        ...current.analytics,
        lastEvent: result.isComplete ? "challenge_completed" : "attempt_failed",
        totalAttempts: current.steps[STEP_ID].attempts.length + 1,
      },
    }));
    setAnnouncement(result.feedback);
    if (next.completedAt && !completionNotifiedRef.current) {
      completionNotifiedRef.current = true;
      onCompleteRef.current(next);
    }
  };

  const asset = E3B_CHALLENGE.steps[STEP_ID].assets;

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-surface/45 shadow-[0_24px_70px_rgba(0,0,0,.2)]">
      <header className="border-b border-line bg-gradient-to-r from-[#0c3155] to-[#0a2945] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-cyan">Electrónica · E3B · Laboratorio</p>
            <h2 id="skill-detail-title" className="mt-2 font-heading text-2xl font-semibold text-ink sm:text-3xl">{E3B_CHALLENGE.title}</h2>
            <p id="skill-detail-description" className="mt-2 text-sm leading-6 text-muted">{E3B_CHALLENGE.subtitle}</p>
          </div>
          <div className="flex gap-2 text-[11px]">
            <Metric label="Intentos" value={String(stepProgress.attempts.length)} />
            <Metric label="Tiempo" value={formatTime(stepProgress.totalActiveSeconds)} />
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(26rem,1.05fr)_minmax(22rem,.95fr)]">
          <section className="min-w-0">
            <div role="tablist" aria-label="Información del laboratorio" className="mb-3 flex gap-2">
              <LabTab active={labTab === "observations"} controls="e3b-observations" onClick={() => setLabTab("observations")}>Esquema y observaciones</LabTab>
              <LabTab active={labTab === "measurements"} controls="e3b-measurements" onClick={() => setLabTab("measurements")}>Mediciones</LabTab>
            </div>
            {labTab === "observations" ? (
              <div id="e3b-observations" role="tabpanel" className="overflow-hidden rounded-2xl border border-line bg-night/30">
                <Image src={`${PUBLIC_BASE_PATH}${asset.schematic.src}`} alt={asset.schematic.alt} width={1600} height={900} className="h-auto w-full" />
                <ul className="space-y-2 border-t border-line p-4 text-xs leading-5 text-muted">
                  <li>• El ESP32 ejecuta el programa y responde por serial.</li>
                  <li>• El driver recibe alimentación lógica y de potencia.</li>
                  <li>• El motor no gira al aplicar la orden de avance.</li>
                </ul>
              </div>
            ) : (
              <div id="e3b-measurements" role="tabpanel" className="overflow-hidden rounded-2xl border border-line bg-night/30">
                <Image src={`${PUBLIC_BASE_PATH}${asset.measurements.src}`} alt={asset.measurements.alt} width={1600} height={900} className="h-auto w-full" />
                <dl className="grid grid-cols-2 gap-2 border-t border-line p-4 sm:grid-cols-3">
                  {E3B_MEASUREMENTS.map((item) => <div key={item.id} className="rounded-xl border border-line bg-surface/40 p-3"><dt className="text-[10px] leading-4 text-muted">{item.label}</dt><dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd></div>)}
                </dl>
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-muted">El diagrama usa el mismo estilo para todas las conexiones: la respuesta no está señalada por color.</p>
          </section>

          <section className="space-y-4">
            <p className="text-sm leading-6 text-muted">{E3B_CHALLENGE.steps[STEP_ID].statement}</p>
            <OptionGroup legend="¿Cuál es la causa raíz más consistente?" name="e3b-cause" options={E3B_CAUSE_OPTIONS} value={draft.causeOptionId ?? ""} disabled={readOnly || solved} onChange={(value) => changeDraft({ causeOptionId: value })} />
            <OptionGroup legend="¿Qué intervención corrige esa causa?" name="e3b-correction" options={E3B_CORRECTION_OPTIONS} value={draft.correctionOptionId ?? ""} disabled={readOnly || solved} onChange={(value) => changeDraft({ correctionOptionId: value })} />
            <label className="block rounded-2xl border border-line bg-night/25 p-4">
              <span className="text-sm font-semibold text-ink">Explica tu diagnóstico</span>
              <span className="mt-1 block text-xs leading-5 text-muted">Conecta síntomas, mediciones, causa y corrección. Mínimo {minimumCharacters} caracteres.</span>
              <textarea value={draft.explanation} disabled={readOnly || solved} rows={6} maxLength={2000} onChange={(event) => changeDraft({ explanation: event.target.value })} className="mt-3 w-full rounded-xl border border-line bg-night/45 p-3 text-sm leading-6 text-ink outline-none focus:border-cyan/50 disabled:opacity-70" />
              <span className="mt-1 block text-right text-[11px] text-muted">{draft.explanation.trim().length}/{minimumCharacters} mínimo</span>
            </label>
          </section>
        </div>

        {stepProgress.revealedHints > 0 && <aside className="mt-5 rounded-2xl border border-cyan/25 bg-cyan/[.07] p-4 text-sm leading-6 text-ice"><span className="font-semibold text-cyan">Pista:</span> {E3B_CHALLENGE.steps[STEP_ID].hints[0]}</aside>}
        {evaluation && (
          <section role="status" className={`mt-5 rounded-2xl border p-4 ${evaluation.isComplete ? "border-ok/30 bg-ok/[.07]" : "border-danger/30 bg-danger/[.07]"}`}>
            <p className={`text-sm font-semibold ${evaluation.isComplete ? "text-ok" : "text-ink"}`}>{evaluation.feedback}</p>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-muted">{evaluation.items.map((item) => <li key={item.id}>{item.feedback}</li>)}</ul>
          </section>
        )}

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <button type="button" onClick={revealHint} disabled={readOnly || solved || stepProgress.revealedHints > 0} className="min-h-11 rounded-xl border border-line px-4 text-xs font-semibold text-muted hover:border-cyan/30 hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:opacity-45">{stepProgress.revealedHints ? "Pista consultada" : "Ver pista"}</button>
          {!solved && !readOnly ? <button type="button" onClick={submit} disabled={!draftReady} className="min-h-11 rounded-xl bg-gradient-to-r from-action to-tech px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-45">Comprobar diagnóstico</button> : <span className="inline-flex min-h-11 items-center rounded-xl border border-ok/30 bg-ok/10 px-4 text-sm font-semibold text-ok">Diagnóstico registrado</span>}
        </footer>
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </article>
  );
}

function LabTab({ active, controls, onClick, children }: { active: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} aria-controls={controls} tabIndex={active ? 0 : -1} onClick={onClick} className={`min-h-10 rounded-xl border px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${active ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-line bg-night/25 text-muted"}`}>{children}</button>;
}

function OptionGroup({ legend, name, options, value, disabled, onChange }: { legend: string; name: string; options: readonly { id: string; label: string }[]; value: string; disabled: boolean; onChange: (id: string) => void }) {
  return <fieldset disabled={disabled} className="rounded-2xl border border-line bg-night/25 p-4"><legend className="sr-only">{legend}</legend><p aria-hidden="true" className="text-sm font-semibold leading-6 text-ink">{legend}</p><div className="mt-3 space-y-2">{options.map((option) => <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-xs leading-5 ${value === option.id ? "border-cyan/40 bg-cyan/10 text-ink" : "border-line bg-surface/35 text-muted"}`}><input type="radio" name={name} checked={value === option.id} onChange={() => onChange(option.id)} className="mt-1 accent-[#84b6d7]" /><span>{option.label}</span></label>)}</div></fieldset>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-line bg-night/35 px-3 py-2 text-center"><strong className="block text-sm text-ink">{value}</strong><span className="text-muted">{label}</span></div>;
}

function createInitialProgress(saved?: NodeChallengeProgress): NodeChallengeProgress {
  const now = Date.now();
  const validSaved = saved?.nodeId === "E3B" ? saved : undefined;
  const savedStep = validSaved?.steps?.[STEP_ID];
  const draft = normalizeDraft(savedStep?.draft);
  const attempts = Array.isArray(savedStep?.attempts)
    ? savedStep.attempts.filter((attempt) => attempt.nodeId === "E3B" && attempt.stepId === STEP_ID)
    : [];
  const solvedAt = typeof savedStep?.solvedAt === "number" && savedStep.solvedAt > 0 ? savedStep.solvedAt : null;
  return {
    nodeId: "E3B",
    currentStepId: STEP_ID,
    shuffleSeed: validSaved?.shuffleSeed ?? now,
    startedAt: validSaved?.startedAt && validSaved.startedAt > 0 ? validSaved.startedAt : now,
    updatedAt: validSaved?.updatedAt && validSaved.updatedAt > 0 ? validSaved.updatedAt : now,
    completedAt: solvedAt ? validSaved?.completedAt ?? solvedAt : null,
    steps: {
      [STEP_ID]: {
        draft: toJson(draft),
        attempts,
        revealedHints: Math.max(0, Math.min(1, savedStep?.revealedHints ?? 0)),
        totalActiveSeconds: Math.max(0, savedStep?.totalActiveSeconds ?? 0),
        solvedAt,
      },
    },
    analytics: validSaved?.analytics ?? { lastEvent: "challenge_started" },
  };
}

function normalizeDraft(raw: unknown): E3BSubmission {
  if (!isRecord(raw)) return createE3BDraft();
  return {
    stepId: STEP_ID,
    ...(typeof raw.causeOptionId === "string" ? { causeOptionId: raw.causeOptionId } : {}),
    ...(typeof raw.correctionOptionId === "string" ? { correctionOptionId: raw.correctionOptionId } : {}),
    explanation: typeof raw.explanation === "string" ? raw.explanation : "",
  };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasSolved(step: ChallengeStepProgress): boolean {
  return typeof step.solvedAt === "number" && Number.isFinite(step.solvedAt) && step.solvedAt > 0;
}
function toJson(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}
function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return safe < 60 ? `${safe}s` : `${Math.floor(safe / 60)}m`;
}

export default E3BChallenge;
