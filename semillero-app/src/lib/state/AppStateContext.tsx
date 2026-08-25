"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AppState,
  CandidateProfile,
  ChallengeAttempt,
  ChallengeStepProgress,
  IntroItem,
  JsonValue,
  NodeChallengeProgress,
  NodeStatus,
} from "@/lib/types";
import { canFinishJourney, computeStatus } from "@/lib/unlock";
import { isValidCandidateProfile } from "@/lib/admissions";
import { E0_STEP_IDS } from "@/lib/challenges/electronics/e0";

const STORAGE_KEY = "semillero-app-state-v1";
const SESSION_KEY = "semillero-session-active";

const emptyProfile: CandidateProfile = {
  fullName: "",
  email: "",
  program: "",
  semester: "",
  cumulativeAverage: "",
  studentCode: "",
  github: "",
  linkedin: "",
  portfolio: "",
  website: "",
  instagram: "",
  consentData: false,
  consentFiles: false,
};

const defaultState: AppState = {
  schemaVersion: 2,
  profile: emptyProfile,
  introduction: [],
  registrationStep: 1,
  onboardingCompleted: false,
  progress: {},
  completedAt: {},
  challengeProgress: {},
  submitted: false,
  submittedAt: null,
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  sessionActive: boolean;
  saveStatus: SaveStatus;
  startSession: () => void;
  endSession: () => void;
  flushNow: () => void;
  updateProfile: (patch: Partial<CandidateProfile>) => void;
  setRegistrationStep: (step: 1 | 2) => void;
  addIntroItem: (item: Omit<IntroItem, "id" | "createdAt">) => void;
  removeIntroItem: (id: string) => void;
  completeOnboarding: () => void;
  saveChallengeProgress: (
    nodeId: string,
    progress: NodeChallengeProgress
  ) => void;
  completeChallenge: (
    nodeId: string,
    progress: NodeChallengeProgress
  ) => void;
  completeNode: (nodeId: string) => void;
  submitJourney: () => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

const INTRO_TYPES = new Set<IntroItem["type"]>([
  "text",
  "image",
  "audio",
  "video",
  "file",
  "link",
]);
const NODE_STATUSES = new Set<NodeStatus>(["locked", "available", "completed"]);
const E0_STEP_ID_SET = new Set<string>(E0_STEP_IDS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveTimestamp(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteNonNegative(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function normalizeProfile(value: unknown): CandidateProfile {
  const source = isRecord(value) ? value : {};
  const text = (key: keyof CandidateProfile) =>
    typeof source[key] === "string" ? source[key] : "";

  return {
    fullName: text("fullName"),
    email: text("email"),
    program: text("program"),
    semester: text("semester"),
    cumulativeAverage: text("cumulativeAverage"),
    studentCode: text("studentCode"),
    github: text("github"),
    linkedin: text("linkedin"),
    portfolio: text("portfolio"),
    website: text("website"),
    instagram: text("instagram"),
    consentData: source.consentData === true,
    consentFiles: source.consentFiles === true,
  };
}

function normalizeJsonValue(value: unknown, depth = 0): JsonValue | undefined {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (depth >= 12) return undefined;
  if (Array.isArray(value)) {
    const normalized: JsonValue[] = [];
    for (const item of value.slice(0, 1_000)) {
      const safeItem = normalizeJsonValue(item, depth + 1);
      if (safeItem !== undefined) normalized.push(safeItem);
    }
    return normalized;
  }
  if (!isRecord(value)) return undefined;

  const normalized: Record<string, JsonValue> = {};
  for (const [key, item] of Object.entries(value).slice(0, 1_000)) {
    const safeItem = normalizeJsonValue(item, depth + 1);
    if (safeItem !== undefined) normalized[key] = safeItem;
  }
  return normalized;
}

function normalizePrimitiveRecord(
  value: unknown
): Record<string, string | number | boolean> {
  if (!isRecord(value)) return {};
  const normalized: Record<string, string | number | boolean> = {};
  for (const [key, item] of Object.entries(value)) {
    if (
      typeof item === "string" ||
      typeof item === "boolean" ||
      (typeof item === "number" && Number.isFinite(item))
    ) {
      normalized[key] = item;
    }
  }
  return normalized;
}

function normalizeAttempt(
  value: unknown,
  stepId: string
): ChallengeAttempt | null {
  if (!isRecord(value)) return null;
  const answer = normalizeJsonValue(value.answer);
  if (
    typeof value.id !== "string" ||
    !value.id ||
    value.nodeId !== "E0" ||
    value.stepId !== stepId ||
    typeof value.attemptNumber !== "number" ||
    !Number.isSafeInteger(value.attemptNumber) ||
    value.attemptNumber < 1 ||
    !isPositiveTimestamp(value.startedAt) ||
    !isPositiveTimestamp(value.submittedAt) ||
    answer === undefined ||
    !(
      value.isCorrect === null ||
      typeof value.isCorrect === "boolean"
    )
  ) {
    return null;
  }

  const score =
    typeof value.score === "number" && Number.isFinite(value.score)
      ? value.score
      : undefined;
  return {
    id: value.id,
    nodeId: "E0",
    stepId,
    attemptNumber: Number(value.attemptNumber),
    startedAt: value.startedAt,
    submittedAt: value.submittedAt,
    durationSeconds: finiteNonNegative(value.durationSeconds),
    answer,
    isCorrect: value.isCorrect,
    hintsUsed: Math.max(0, Math.trunc(finiteNonNegative(value.hintsUsed))),
    ...(score === undefined ? {} : { score }),
    metadata: normalizePrimitiveRecord(value.metadata),
  };
}

function normalizeStepProgress(
  value: unknown,
  stepId: string,
  now: number
): ChallengeStepProgress | null {
  if (!isRecord(value)) return null;
  const draft = normalizeJsonValue(value.draft);
  const attempts = Array.isArray(value.attempts)
    ? value.attempts
        .map((attempt) => normalizeAttempt(attempt, stepId))
        .filter((attempt): attempt is ChallengeAttempt => attempt !== null)
        .sort((left, right) => left.submittedAt - right.submittedAt)
    : [];

  return {
    draft: draft ?? null,
    attempts,
    revealedHints: Math.max(
      0,
      Math.min(1, Math.trunc(finiteNonNegative(value.revealedHints)))
    ),
    totalActiveSeconds: finiteNonNegative(value.totalActiveSeconds),
    solvedAt: isPositiveTimestamp(value.solvedAt)
      ? Math.min(value.solvedAt, now)
      : null,
  };
}

function normalizeE0Progress(
  value: unknown,
  now = Date.now()
): NodeChallengeProgress | null {
  if (!isRecord(value) || value.nodeId !== "E0" || !isRecord(value.steps)) {
    return null;
  }

  const steps: Record<string, ChallengeStepProgress> = {};
  for (const stepId of E0_STEP_IDS) {
    const normalized = normalizeStepProgress(value.steps[stepId], stepId, now);
    if (normalized) steps[stepId] = normalized;
  }

  const startedAt = isPositiveTimestamp(value.startedAt)
    ? Math.min(value.startedAt, now)
    : now;
  const updatedAt = isPositiveTimestamp(value.updatedAt)
    ? Math.min(value.updatedAt, now)
    : startedAt;
  const completedAt = isPositiveTimestamp(value.completedAt)
    ? Math.min(value.completedAt, now)
    : null;
  const currentStepId =
    typeof value.currentStepId === "string" && E0_STEP_ID_SET.has(value.currentStepId)
      ? value.currentStepId
      : E0_STEP_IDS.find((stepId) => !isPositiveTimestamp(steps[stepId]?.solvedAt)) ??
        E0_STEP_IDS[0];

  return {
    nodeId: "E0",
    currentStepId,
    shuffleSeed:
      typeof value.shuffleSeed === "number" && Number.isFinite(value.shuffleSeed)
        ? Math.trunc(value.shuffleSeed)
        : Math.trunc(now),
    startedAt,
    updatedAt,
    completedAt,
    steps,
    analytics: normalizePrimitiveRecord(value.analytics),
  };
}

function normalizeProgress(value: unknown): Record<string, NodeStatus> {
  if (!isRecord(value)) return {};
  const normalized: Record<string, NodeStatus> = {};
  for (const [nodeId, status] of Object.entries(value)) {
    if (typeof status === "string" && NODE_STATUSES.has(status as NodeStatus)) {
      normalized[nodeId] = status as NodeStatus;
    }
  }
  return normalized;
}

function normalizeCompletedAt(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const normalized: Record<string, number> = {};
  for (const [nodeId, timestamp] of Object.entries(value)) {
    if (isPositiveTimestamp(timestamp)) normalized[nodeId] = timestamp;
  }
  return normalized;
}

function normalizeIntroduction(value: unknown): IntroItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.type !== "string" ||
      !INTRO_TYPES.has(item.type as IntroItem["type"]) ||
      typeof item.title !== "string" ||
      typeof item.content !== "string" ||
      !isPositiveTimestamp(item.createdAt)
    ) {
      return [];
    }
    return [
      {
        id: item.id,
        type: item.type as IntroItem["type"],
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
      },
    ];
  });
}

function mergeChallengeProgress(
  current: NodeChallengeProgress | undefined,
  incoming: NodeChallengeProgress
): NodeChallengeProgress {
  const now = Date.now();
  const safeIncoming = normalizeE0Progress(incoming, now);
  const safeCurrent = normalizeE0Progress(current, now);
  if (!safeIncoming) return safeCurrent ?? incoming;
  if (!safeCurrent) return safeIncoming;
  if (safeIncoming.updatedAt < safeCurrent.updatedAt) return safeCurrent;

  const steps = { ...safeCurrent.steps };
  for (const [stepId, nextStep] of Object.entries(safeIncoming.steps)) {
    const previousStep = safeCurrent.steps[stepId];
    if (!previousStep) {
      steps[stepId] = nextStep;
      continue;
    }

    const attempts = new Map(
      [...previousStep.attempts, ...nextStep.attempts].map((attempt) => [
        attempt.id,
        attempt,
      ])
    );
    steps[stepId] = {
      ...nextStep,
      attempts: [...attempts.values()].sort(
        (left, right) => left.submittedAt - right.submittedAt
      ),
      revealedHints: Math.max(
        previousStep.revealedHints,
        nextStep.revealedHints
      ),
      totalActiveSeconds: Math.max(
        previousStep.totalActiveSeconds,
        nextStep.totalActiveSeconds
      ),
      solvedAt: previousStep.solvedAt ?? nextStep.solvedAt,
    };
  }

  return {
    ...safeIncoming,
    nodeId: safeIncoming.nodeId,
    shuffleSeed: safeCurrent.shuffleSeed,
    startedAt: Math.min(safeCurrent.startedAt, safeIncoming.startedAt),
    completedAt: safeCurrent.completedAt ?? safeIncoming.completedAt,
    steps,
    analytics: { ...safeCurrent.analytics, ...safeIncoming.analytics },
  };
}

function hasCompletedE0(progress: NodeChallengeProgress | undefined): boolean {
  return Boolean(
    progress?.nodeId === "E0" &&
      E0_STEP_IDS.every((stepId) =>
        isPositiveTimestamp(progress.steps?.[stepId]?.solvedAt)
      )
  );
}

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsedValue: unknown = JSON.parse(raw);
    if (!isRecord(parsedValue)) return defaultState;
    const parsed = parsedValue;
    const profile = normalizeProfile(parsed.profile);
    const profileLooksComplete = isValidCandidateProfile(profile);
    const challengeProgress: Record<string, NodeChallengeProgress> = {};
    const rawChallenges = isRecord(parsed.challengeProgress)
      ? parsed.challengeProgress
      : {};
    const normalizedE0 = normalizeE0Progress(rawChallenges.E0);
    if (normalizedE0) challengeProgress.E0 = normalizedE0;
    const progress = normalizeProgress(parsed.progress);
    const completedAt = normalizeCompletedAt(parsed.completedAt);
    const sourceVersion =
      typeof parsed.schemaVersion === "number" &&
      Number.isFinite(parsed.schemaVersion)
        ? parsed.schemaVersion
        : 1;
    const isLegacySource = sourceVersion <= 1;
    const e0Progress = challengeProgress.E0;
    const e0IsComplete = hasCompletedE0(e0Progress);
    const submitted = parsed.submitted === true;
    const introduction = normalizeIntroduction(parsed.introduction);

    // E0 used to be completed by a prototype button. Once the real five-step
    // challenge exists, that marker is not valid evidence. Reopen only the
    // Electronics branch while preserving registration and every other branch.
    if (
      isLegacySource &&
      !submitted &&
      progress.E0 === "completed" &&
      !e0IsComplete
    ) {
      for (const nodeId of ["E0", "E1A", "E1B", "E2", "E3A", "E3B", "E4"]) {
        delete progress[nodeId];
        delete completedAt[nodeId];
      }
    }

    // Recover a challenge that finished just before an interrupted tree-state
    // write. Detailed solved steps are the source of truth for implemented nodes.
    if (e0Progress && e0IsComplete) {
      const completionTimestamp =
        e0Progress.completedAt ??
        Math.max(
          ...E0_STEP_IDS.map((stepId) => e0Progress.steps[stepId].solvedAt ?? 0)
        );
      challengeProgress.E0 = {
        ...e0Progress,
        completedAt: completionTimestamp,
      };
      if (!submitted) {
        progress.E0 = "completed";
        completedAt.E0 = completionTimestamp;
      }
    }

    return {
      schemaVersion: 2,
      profile,
      progress,
      completedAt,
      challengeProgress,
      introduction,
      registrationStep:
        parsed.registrationStep === 2
          ? 2
          : parsed.registrationStep === 1
            ? 1
            : profileLooksComplete
              ? 2
              : 1,
      onboardingCompleted:
        typeof parsed.onboardingCompleted === "boolean"
          ? parsed.onboardingCompleted
          : Boolean(
              submitted ||
                Object.keys(progress).length > 0 ||
                (profileLooksComplete && introduction.length > 0)
            ),
      submitted,
      submittedAt: isPositiveTimestamp(parsed.submittedAt)
        ? parsed.submittedAt
        : null,
    };
  } catch {
    return defaultState;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<AppState>(defaultState);

  useEffect(() => {
    // One-time sync from localStorage after mount, so SSR/client hydration match.
    const restoredState = loadState();
    stateRef.current = restoredState;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(restoredState);
    try {
      setSessionActive(window.sessionStorage.getItem(SESSION_KEY) === "true");
    } catch {
      setSessionActive(false);
      setSaveStatus("error");
    }
    setHydrated(true);
  }, []);

  const commitState = useCallback(
    (update: (previous: AppState) => AppState) => {
      const next = update(stateRef.current);
      if (Object.is(next, stateRef.current)) return;
      stateRef.current = next;
      setState(next);
    },
    []
  );

  const persistState = useCallback((snapshot: AppState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, []);

  const flushNow = useCallback(() => {
    if (typeof window === "undefined") return;
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }
    persistState(stateRef.current);
  }, [persistState]);

  const startSession = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      setSaveStatus("error");
    }
    setSessionActive(true);
  }, []);

  const endSession = useCallback(() => {
    flushNow();
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      setSaveStatus("error");
    }
    setSessionActive(false);
  }, [flushNow]);

  useEffect(() => {
    if (!hydrated) return;
    // Debounced sync to localStorage whenever state changes (autosave).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveStatus("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveTimeout.current = null;
      persistState(state);
    }, 350);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [state, hydrated, persistState]);

  useEffect(() => {
    if (!hydrated) return;
    const persistBeforeLeaving = () => flushNow();
    const persistWhenHidden = () => {
      if (document.visibilityState === "hidden") flushNow();
    };
    window.addEventListener("pagehide", persistBeforeLeaving);
    document.addEventListener("visibilitychange", persistWhenHidden);
    return () => {
      window.removeEventListener("pagehide", persistBeforeLeaving);
      document.removeEventListener("visibilitychange", persistWhenHidden);
    };
  }, [flushNow, hydrated]);

  const updateProfile = useCallback((patch: Partial<CandidateProfile>) => {
    commitState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  }, [commitState]);

  const setRegistrationStep = useCallback((registrationStep: 1 | 2) => {
    commitState((prev) => ({ ...prev, registrationStep }));
  }, [commitState]);

  const addIntroItem = useCallback((item: Omit<IntroItem, "id" | "createdAt">) => {
    commitState((prev) => ({
      ...prev,
      introduction: [
        ...prev.introduction,
        { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
      ],
    }));
  }, [commitState]);

  const removeIntroItem = useCallback((id: string) => {
    commitState((prev) => ({
      ...prev,
      introduction: prev.introduction.filter((item) => item.id !== id),
    }));
  }, [commitState]);

  const completeOnboarding = useCallback(() => {
    commitState((prev) => ({ ...prev, onboardingCompleted: true }));
  }, [commitState]);

  const saveChallengeProgress = useCallback(
    (nodeId: string, challengeProgress: NodeChallengeProgress) => {
      commitState((prev) => {
        const normalized =
          nodeId === "E0" ? normalizeE0Progress(challengeProgress) : null;
        if (!normalized || normalized.nodeId !== nodeId) return prev;
        const merged = mergeChallengeProgress(
          prev.challengeProgress[nodeId],
          normalized
        );
        if (Object.is(merged, prev.challengeProgress[nodeId])) return prev;
        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [nodeId]: merged,
          },
        };
      });
    },
    [commitState]
  );

  const completeChallenge = useCallback(
    (nodeId: string, challengeProgress: NodeChallengeProgress) => {
      commitState((prev) => {
        const normalized =
          nodeId === "E0" ? normalizeE0Progress(challengeProgress) : null;
        if (
          nodeId !== "E0" ||
          !normalized ||
          normalized.nodeId !== nodeId ||
          prev.submitted ||
          !isValidCandidateProfile(prev.profile) ||
          computeStatus(nodeId, prev.progress) !== "available"
        ) {
          return prev;
        }

        const completedChallenge = mergeChallengeProgress(
          prev.challengeProgress[nodeId],
          {
            ...normalized,
            completedAt: normalized.completedAt ?? Date.now(),
            updatedAt: Date.now(),
          }
        );
        if (!hasCompletedE0(completedChallenge)) return prev;

        const timestamp = completedChallenge.completedAt ?? Date.now();
        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [nodeId]: { ...completedChallenge, completedAt: timestamp },
          },
          progress: { ...prev.progress, [nodeId]: "completed" as NodeStatus },
          completedAt: { ...prev.completedAt, [nodeId]: timestamp },
        };
      });
    },
    [commitState]
  );

  const completeNode = useCallback((nodeId: string) => {
    commitState((prev) => {
      if (
        prev.submitted ||
        !isValidCandidateProfile(prev.profile) ||
        nodeId === "E0" ||
        computeStatus(nodeId, prev.progress) !== "available"
      ) {
        return prev;
      }
      return {
        ...prev,
        progress: { ...prev.progress, [nodeId]: "completed" as NodeStatus },
        completedAt: { ...prev.completedAt, [nodeId]: Date.now() },
      };
    });
  }, [commitState]);

  const submitJourney = useCallback(() => {
    commitState((prev) => {
      if (
        prev.submitted ||
        !isValidCandidateProfile(prev.profile) ||
        !canFinishJourney(prev.progress)
      ) {
        return prev;
      }
      return { ...prev, submitted: true, submittedAt: Date.now() };
    });
  }, [commitState]);

  const resetAll = useCallback(() => {
    let storageError = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      storageError = true;
    }
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      storageError = true;
    }
    stateRef.current = defaultState;
    setState(defaultState);
    setSessionActive(false);
    setSaveStatus(storageError ? "error" : "idle");
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      sessionActive,
      saveStatus,
      startSession,
      endSession,
      flushNow,
      updateProfile,
      setRegistrationStep,
      addIntroItem,
      removeIntroItem,
      completeOnboarding,
      saveChallengeProgress,
      completeChallenge,
      completeNode,
      submitJourney,
      resetAll,
    }),
    [
      state,
      hydrated,
      sessionActive,
      saveStatus,
      startSession,
      endSession,
      flushNow,
      updateProfile,
      setRegistrationStep,
      addIntroItem,
      removeIntroItem,
      completeOnboarding,
      saveChallengeProgress,
      completeChallenge,
      completeNode,
      submitJourney,
      resetAll,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
