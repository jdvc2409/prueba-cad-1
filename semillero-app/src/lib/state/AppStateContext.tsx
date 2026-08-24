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
  IntroItem,
  NodeStatus,
} from "@/lib/types";
import { canFinishJourney } from "@/lib/unlock";
import { isValidCandidateProfile } from "@/lib/admissions";

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
  profile: emptyProfile,
  introduction: [],
  registrationStep: 1,
  onboardingCompleted: false,
  progress: {},
  completedAt: {},
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
  completeNode: (nodeId: string) => void;
  submitJourney: () => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const profile = { ...emptyProfile, ...(parsed.profile ?? {}) };
    const profileLooksComplete = isValidCandidateProfile(profile);
    return {
      profile,
      progress: parsed.progress ?? {},
      completedAt: parsed.completedAt ?? {},
      introduction: parsed.introduction ?? [],
      registrationStep: parsed.registrationStep ?? (profileLooksComplete ? 2 : 1),
      onboardingCompleted:
        parsed.onboardingCompleted ??
        Boolean(
          parsed.submitted ||
            Object.keys(parsed.progress ?? {}).length > 0 ||
            (profileLooksComplete && (parsed.introduction?.length ?? 0) > 0)
        ),
      submitted: parsed.submitted ?? false,
      submittedAt: parsed.submittedAt ?? null,
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

  const completeNode = useCallback((nodeId: string) => {
    commitState((prev) => {
      if (prev.submitted || !isValidCandidateProfile(prev.profile)) return prev;
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
