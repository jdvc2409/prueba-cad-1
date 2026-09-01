"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  D2_CHALLENGE,
  D2_OPTIONS,
  createD2Draft,
  evaluateD2,
  type D2Submission,
} from "@/lib/challenges/design/d2";
import {
  DesignChallengeShell,
  DesignFooter,
  DesignHintPanel,
  DesignOptionGrid,
  DesignResultBanner,
} from "@/components/challenges/design/shared";
import type { ChallengeAttempt, JsonValue, NodeChallengeProgress } from "@/lib/types";

const NODE_ID = "D2";
const STEP_ID = "lightening";

interface Props {
  savedProgress?: NodeChallengeProgress;
  readOnly: boolean;
  onSave: (progress: NodeChallengeProgress) => void;
  onComplete: (finalProgress: NodeChallengeProgress) => void;
  onExit?: () => void;
}

export function D2Challenge({ savedProgress, readOnly, onSave, onComplete, onExit }: Props) {
  const initial = useMemo(() => createInitialProgress(savedProgress), [savedProgress]);
  const [progress, setProgress] = useState(initial);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const progressRef = useRef(initial);
  const onSaveRef = useRef(onSave);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const step = progress.steps[STEP_ID];
  const draft = normalizeDraft(step.draft);
  const solved = Boolean(step.solvedAt);

  const persist = useCallback((next: NodeChallengeProgress) => {
    progressRef.current = next;
    setProgress(next);
    onSaveRef.current(next);
  }, []);

  function toggleOption(id: string) {
    if (readOnly || solved) return;
    const nextSelected = draft.selected.includes(id)
      ? draft.selected.filter((v) => v !== id)
      : [...draft.selected, id];
    const nextDraft: D2Submission = { stepId: "lightening", selected: nextSelected };
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: Date.now(),
      steps: {
        ...progressRef.current.steps,
        [STEP_ID]: { ...progressRef.current.steps[STEP_ID], draft: toJson(nextDraft) },
      },
    };
    persist(next);
  }

  function revealHint() {
    if (readOnly || solved) return;
    const current = progressRef.current.steps[STEP_ID];
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: Date.now(),
      steps: {
        ...progressRef.current.steps,
        [STEP_ID]: { ...current, revealedHints: Math.min(current.revealedHints + 1, D2_CHALLENGE.steps.lightening.hints.length) },
      },
    };
    persist(next);
  }

  function submit() {
    if (readOnly || solved) return;
    const evaluation = evaluateD2(draft);
    const now = Date.now();
    const current = progressRef.current.steps[STEP_ID];
    const attempt: ChallengeAttempt = {
      id: crypto.randomUUID(),
      nodeId: NODE_ID,
      stepId: STEP_ID,
      attemptNumber: current.attempts.length + 1,
      startedAt: progress.startedAt,
      submittedAt: now,
      durationSeconds: current.totalActiveSeconds,
      answer: toJson(draft),
      isCorrect: evaluation.isCorrect,
      hintsUsed: current.revealedHints,
    };
    const nextStep = {
      ...current,
      attempts: [...current.attempts, attempt],
      solvedAt: evaluation.isCorrect ? now : current.solvedAt,
    };
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: now,
      completedAt: evaluation.isCorrect ? now : progressRef.current.completedAt,
      steps: { ...progressRef.current.steps, [STEP_ID]: nextStep },
    };
    persist(next);
    setLastResult({ isCorrect: evaluation.isCorrect, message: evaluation.feedback });
    if (evaluation.isCorrect) onCompleteRef.current(next);
  }

  const totalAttempts = step.attempts.length;

  return (
    <DesignChallengeShell
      nodeId={NODE_ID}
      categoryLabel={D2_CHALLENGE.subtitle.split("·")[0].trim()}
      title={D2_CHALLENGE.title}
      introduction={D2_CHALLENGE.introduction}
      readOnly={readOnly}
      attempts={totalAttempts}
      hintsUsed={step.revealedHints}
      solved={solved}
    >
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9FD3EE]">
          {D2_CHALLENGE.steps.lightening.eyebrow}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-white">
          {D2_CHALLENGE.steps.lightening.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          {D2_CHALLENGE.steps.lightening.statement}
        </p>
      </header>

      <div className="space-y-6">
        <MountingSurfacesDiagram />

        <DesignOptionGrid
          options={D2_OPTIONS}
          selected={draft.selected}
          multi
          disabled={readOnly || solved}
          onToggle={toggleOption}
        />

        {lastResult && <DesignResultBanner isCorrect={lastResult.isCorrect} message={lastResult.message} />}

        <DesignHintPanel
          hints={D2_CHALLENGE.steps.lightening.hints}
          revealed={step.revealedHints}
          disabled={readOnly || solved}
          onReveal={revealHint}
        />
      </div>

      <DesignFooter
        solved={solved}
        readOnly={readOnly}
        canSubmit={draft.selected.length > 0}
        submitLabel={totalAttempts > 0 ? "Comprobar de nuevo" : "Comprobar respuesta"}
        onSubmit={submit}
        onExit={onExit}
      />
    </DesignChallengeShell>
  );
}

/** Diagrama propio (SVG): bloque con dos caras de montaje resaltadas y sus agujeros de sujeción. */
function MountingSurfacesDiagram() {
  return (
    <figure className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#071820]">
      <div className="flex justify-center p-4 sm:p-6">
        <svg viewBox="0 0 420 220" className="w-full max-w-md" role="img" aria-label="Bloque con superficies de montaje resaltadas en la base y en la cara izquierda">
          {/* cuerpo principal */}
          <rect x="90" y="30" width="240" height="130" rx="6" fill="#13314a" stroke="#3455D1" strokeWidth="2" />
          {/* cara de montaje inferior (resaltada) */}
          <rect x="90" y="150" width="240" height="14" rx="3" fill="#FFB84D" opacity="0.85" />
          <text x="210" y="196" textAnchor="middle" fill="#FFB84D" fontSize="11" fontFamily="monospace">
            Superficie de montaje (base)
          </text>
          {/* cara de montaje izquierda (resaltada) */}
          <rect x="76" y="30" width="14" height="130" rx="3" fill="#FFB84D" opacity="0.85" />
          <text x="40" y="98" textAnchor="middle" fill="#FFB84D" fontSize="11" fontFamily="monospace" transform="rotate(-90 40 98)">
            Montaje lateral
          </text>
          {/* agujeros de sujeción en la base */}
          <circle cx="130" cy="157" r="6" fill="#0B1220" stroke="#FFB84D" strokeWidth="2" />
          <circle cx="290" cy="157" r="6" fill="#0B1220" stroke="#FFB84D" strokeWidth="2" />
          {/* zona interior libre (sugerida para aligerar) */}
          <rect x="130" y="55" width="160" height="70" rx="10" fill="none" stroke="#8CA0F0" strokeDasharray="6 5" strokeWidth="2" />
          <text x="210" y="95" textAnchor="middle" fill="#8CA0F0" fontSize="11" fontFamily="monospace">
            Zona sin función de montaje
          </text>
        </svg>
      </div>
      <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-5 text-slate-400">
        Las superficies en color ámbar (base y lateral) son de montaje: no se pueden alterar. El área punteada no tiene función de sujeción.
      </figcaption>
    </figure>
  );
}

function createInitialProgress(saved?: NodeChallengeProgress): NodeChallengeProgress {
  if (saved) return saved;
  const now = Date.now();
  return {
    nodeId: NODE_ID,
    currentStepId: STEP_ID,
    shuffleSeed: now,
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    steps: {
      [STEP_ID]: {
        draft: toJson(createD2Draft()),
        attempts: [],
        revealedHints: 0,
        totalActiveSeconds: 0,
        solvedAt: null,
      },
    },
    analytics: {},
  };
}

function normalizeDraft(raw: JsonValue): D2Submission {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && Array.isArray((raw as { selected?: unknown }).selected)) {
    const selected = (raw as { selected: unknown[] }).selected.filter((v): v is string => typeof v === "string");
    return { stepId: "lightening", selected };
  }
  return createD2Draft();
}

function toJson(value: D2Submission): JsonValue {
  return { stepId: value.stepId, selected: [...value.selected] };
}
