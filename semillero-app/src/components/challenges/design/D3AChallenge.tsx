"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  D3A_CHALLENGE,
  D3A_STEP_IDS,
  createD3ADraft,
  evaluateD3AStep,
  type D3AStepGeometry,
  type D3AStepId,
  type D3ASubmission,
} from "@/lib/challenges/design/d3a";
import {
  DESIGN_BRAND,
  DESIGN_BRAND_LIGHT,
  DesignFooter,
  DesignHintPanel,
  DesignResultBanner,
} from "@/components/challenges/design/shared";
import type { ChallengeAttempt, JsonValue, NodeChallengeProgress } from "@/lib/types";

const NODE_ID = "D3A";

interface Props {
  savedProgress?: NodeChallengeProgress;
  readOnly: boolean;
  onSave: (progress: NodeChallengeProgress) => void;
  onComplete: (finalProgress: NodeChallengeProgress) => void;
  onExit?: () => void;
}

export function D3AChallenge({ savedProgress, readOnly, onSave, onComplete, onExit }: Props) {
  const initial = useMemo(() => createInitialProgress(savedProgress), [savedProgress]);
  const [progress, setProgress] = useState(initial);
  const [lastResult, setLastResult] = useState<Partial<Record<D3AStepId, { isCorrect: boolean; message: string }>>>({});
  const progressRef = useRef(initial);
  const onSaveRef = useRef(onSave);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const solvedCount = D3A_STEP_IDS.filter((id) => Boolean(progress.steps[id]?.solvedAt)).length;
  const firstUnsolved = D3A_STEP_IDS.find((id) => !progress.steps[id]?.solvedAt) ?? D3A_STEP_IDS[D3A_STEP_IDS.length - 1];
  const [activeStepId, setActiveStepId] = useState<D3AStepId>(firstUnsolved);

  const persist = useCallback((next: NodeChallengeProgress) => {
    progressRef.current = next;
    setProgress(next);
    onSaveRef.current(next);
  }, []);

  function selectStep(id: D3AStepId) {
    const idx = D3A_STEP_IDS.indexOf(id);
    const unlockedIdx = D3A_STEP_IDS.indexOf(firstUnsolved);
    if (idx <= unlockedIdx) setActiveStepId(id);
  }

  function changeValue(stepId: D3AStepId, value: string) {
    if (readOnly) return;
    if (progressRef.current.steps[stepId]?.solvedAt) return;
    const nextDraft: D3ASubmission = { stepId, value };
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: Date.now(),
      currentStepId: stepId,
      steps: {
        ...progressRef.current.steps,
        [stepId]: { ...progressRef.current.steps[stepId], draft: toJson(nextDraft) },
      },
    };
    persist(next);
  }

  function revealHint(stepId: D3AStepId) {
    if (readOnly || progressRef.current.steps[stepId]?.solvedAt) return;
    const current = progressRef.current.steps[stepId];
    const maxHints = D3A_CHALLENGE.steps[stepId].hints.length;
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: Date.now(),
      steps: {
        ...progressRef.current.steps,
        [stepId]: { ...current, revealedHints: Math.min(current.revealedHints + 1, maxHints) },
      },
    };
    persist(next);
  }

  function submit(stepId: D3AStepId) {
    if (readOnly || progressRef.current.steps[stepId]?.solvedAt) return;
    const draft = normalizeDraft(stepId, progressRef.current.steps[stepId].draft);
    const evaluation = evaluateD3AStep(draft);
    const now = Date.now();
    const current = progressRef.current.steps[stepId];
    const attempt: ChallengeAttempt = {
      id: crypto.randomUUID(),
      nodeId: NODE_ID,
      stepId,
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
    const allStepsAfterThis = { ...progressRef.current.steps, [stepId]: nextStep };
    const allSolved = D3A_STEP_IDS.every((id) => Boolean(allStepsAfterThis[id]?.solvedAt));
    const next: NodeChallengeProgress = {
      ...progressRef.current,
      updatedAt: now,
      completedAt: allSolved ? now : progressRef.current.completedAt,
      steps: allStepsAfterThis,
    };
    persist(next);
    setLastResult((prev) => ({ ...prev, [stepId]: { isCorrect: evaluation.isCorrect, message: evaluation.feedback } }));

    if (evaluation.isCorrect) {
      const idx = D3A_STEP_IDS.indexOf(stepId);
      const nextStepId = D3A_STEP_IDS[idx + 1];
      if (nextStepId) setActiveStepId(nextStepId);
      if (allSolved) onCompleteRef.current(next);
    }
  }

  const allSolved = solvedCount === D3A_STEP_IDS.length;
  const activeStep = D3A_CHALLENGE.steps[activeStepId];
  const activeDraft = normalizeDraft(activeStepId, progress.steps[activeStepId].draft);
  const activeSolved = Boolean(progress.steps[activeStepId].solvedAt);
  const activeAttempts = progress.steps[activeStepId].attempts.length;
  const activeResult = lastResult[activeStepId];

  return (
    <section
      className="overflow-hidden rounded-3xl border shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
      style={{ borderColor: `${DESIGN_BRAND}40`, background: "#0B1220" }}
    >
      <div
        className="border-b border-white/10 px-5 py-5 sm:px-7 lg:px-9"
        style={{
          background: `radial-gradient(circle at top right, ${DESIGN_BRAND}30, transparent 45%), linear-gradient(135deg,#101a35,#0b1428)`,
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ borderColor: `${DESIGN_BRAND_LIGHT}4D`, background: `${DESIGN_BRAND_LIGHT}1A`, color: DESIGN_BRAND_LIGHT }}
          >
            {NODE_ID} · {D3A_CHALLENGE.subtitle.split("·")[0].trim()}
          </span>
          {readOnly && (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
              Solo lectura
            </span>
          )}
          {allSolved && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200">
              Completado
            </span>
          )}
        </div>
        <h2 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
          {D3A_CHALLENGE.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{D3A_CHALLENGE.introduction}</p>
        <p className="mt-1 text-xs text-slate-400">Material: {D3A_CHALLENGE.material}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-white">Paso {D3A_STEP_IDS.indexOf(activeStepId) + 1} de {D3A_STEP_IDS.length}</span>
            <span className="text-slate-400">{solvedCount}/{D3A_STEP_IDS.length} resueltos</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${(solvedCount / D3A_STEP_IDS.length) * 100}%`, background: `linear-gradient(90deg, ${DESIGN_BRAND}, ${DESIGN_BRAND_LIGHT})` }}
            />
          </div>
        </div>
      </div>

      <nav className="border-b border-white/10 bg-[#0d1730] px-4 py-3 sm:px-6">
        <ol className="grid grid-cols-3 gap-2">
          {D3A_STEP_IDS.map((id, idx) => {
            const s = progress.steps[id];
            const isSolved = Boolean(s?.solvedAt);
            const isCurrent = id === activeStepId;
            const unlockedIdx = D3A_STEP_IDS.indexOf(firstUnsolved);
            const isLocked = idx > unlockedIdx;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => selectStep(id)}
                  className={`flex min-h-[52px] w-full items-center gap-2 rounded-xl border px-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isCurrent ? "border-[#8CA0F0]/60 bg-[#3455D1]/15" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isCurrent ? "bg-[#8CA0F0]/25 text-[#8CA0F0]" : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    {isSolved ? "✓" : idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200">{D3A_CHALLENGE.steps[id].title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="px-5 py-6 sm:px-7 lg:px-9 lg:py-8">
        <header className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9FD3EE]">{activeStep.eyebrow}</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-white">{activeStep.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{activeStep.statement}</p>
        </header>

        <div className="space-y-6">
          <PlateDiagram geometry={activeStep.geometry} />

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <label htmlFor={`D3A-${activeStepId}`} className="block text-sm font-semibold leading-6 text-white">
              Masa (g)
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id={`D3A-${activeStepId}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={activeDraft.value}
                disabled={readOnly || activeSolved}
                onChange={(e) => changeValue(activeStepId, e.target.value)}
                placeholder="Ej. 123456789"
                className="w-full rounded-lg border border-white/15 bg-[#03152f] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#8CA0F0] disabled:opacity-60"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">Tolerancia de ±2% sobre el valor de referencia.</p>
          </div>

          {activeResult && <DesignResultBanner isCorrect={activeResult.isCorrect} message={activeResult.message} />}

          <DesignHintPanel
            hints={activeStep.hints}
            revealed={progress.steps[activeStepId].revealedHints}
            disabled={readOnly || activeSolved}
            onReveal={() => revealHint(activeStepId)}
          />
        </div>

        <DesignFooter
          solved={activeSolved}
          readOnly={readOnly}
          canSubmit={activeDraft.value.trim().length > 0}
          submitLabel={activeAttempts > 0 ? "Comprobar de nuevo" : "Comprobar respuesta"}
          onSubmit={() => submit(activeStepId)}
          onExit={onExit}
        />
      </div>
    </section>
  );
}

/** Diagrama propio (SVG): vista superior de la placa con muesca y agujero(s). */
function PlateDiagram({ geometry }: { geometry: D3AStepGeometry }) {
  const scale = 3.2;
  const w = geometry.length * scale;
  const h = geometry.width * scale;
  const notch = geometry.notch * scale;
  const pad = 20;
  const viewW = w + pad * 2;
  const viewH = h + pad * 2;

  return (
    <figure className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#071820]">
      <div className="flex justify-center p-4 sm:p-6">
        <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full max-w-sm" role="img" aria-label="Vista superior de la placa con muesca y agujeros">
          <g transform={`translate(${pad},${pad})`}>
            <path
              d={`M0 0 H${w} V${h} H${notch} V${h - notch} H0 Z`}
              fill="#13314a"
              stroke="#3455D1"
              strokeWidth="2"
            />
            {geometry.holes.map((d, i) => {
              const r = (d * scale) / 2;
              const cx = w * (0.55 + i * 0.22);
              const cy = h * 0.4;
              return <circle key={i} cx={cx} cy={cy} r={r} fill="#0B1220" stroke="#8CA0F0" strokeWidth="2" />;
            })}
            <text x={w / 2} y={-6} textAnchor="middle" fill="#9FD3EE" fontSize="10" fontFamily="monospace">
              {geometry.length} mm
            </text>
            <text x={-8} y={h / 2} textAnchor="middle" fill="#9FD3EE" fontSize="10" fontFamily="monospace" transform={`rotate(-90 -8 ${h / 2})`}>
              {geometry.width} mm
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-5 text-slate-400">
        Espesor: {geometry.height} mm · Muesca: {geometry.notch}×{geometry.notch} mm · Agujero(s): {geometry.holes.map((d) => `Ø${d}`).join(", ")} mm — todo pasante.
      </figcaption>
    </figure>
  );
}

function createInitialProgress(saved?: NodeChallengeProgress): NodeChallengeProgress {
  if (saved) return saved;
  const now = Date.now();
  return {
    nodeId: NODE_ID,
    currentStepId: D3A_STEP_IDS[0],
    shuffleSeed: now,
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    steps: Object.fromEntries(
      D3A_STEP_IDS.map((id) => [
        id,
        {
          draft: toJson(createD3ADraft(id)),
          attempts: [],
          revealedHints: 0,
          totalActiveSeconds: 0,
          solvedAt: null,
        },
      ])
    ),
    analytics: {},
  };
}

function normalizeDraft(stepId: D3AStepId, raw: JsonValue): D3ASubmission {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && typeof (raw as { value?: unknown }).value === "string") {
    return { stepId, value: (raw as { value: string }).value };
  }
  return createD3ADraft(stepId);
}

function toJson(value: D3ASubmission): JsonValue {
  return { stepId: value.stepId, value: value.value };
}
