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
  Availability,
  CandidateProfile,
  IntroItem,
  NodeStatus,
} from "@/lib/types";

const STORAGE_KEY = "semillero-app-state-v1";

const emptyProfile: CandidateProfile = {
  fullName: "",
  email: "",
  program: "",
  semester: "",
  studentCode: "",
  github: "",
  linkedin: "",
  portfolio: "",
  website: "",
  instagram: "",
  consentData: false,
  consentFiles: false,
};

const emptyAvailability: Availability = {
  hoursPerWeek: "",
  days: [],
  modality: "",
  timeOfDay: "",
  commitment: "",
};

const defaultState: AppState = {
  profile: emptyProfile,
  introduction: [],
  availability: emptyAvailability,
  progress: {},
  completedAt: {},
  submitted: false,
  submittedAt: null,
};

type SaveStatus = "idle" | "saving" | "saved";

interface AppStateContextValue {
  state: AppState;
  saveStatus: SaveStatus;
  updateProfile: (patch: Partial<CandidateProfile>) => void;
  updateAvailability: (patch: Partial<Availability>) => void;
  addIntroItem: (item: Omit<IntroItem, "id" | "createdAt">) => void;
  removeIntroItem: (id: string) => void;
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
    return {
      ...defaultState,
      ...parsed,
      profile: { ...emptyProfile, ...(parsed.profile ?? {}) },
      availability: { ...emptyAvailability, ...(parsed.availability ?? {}) },
      progress: parsed.progress ?? {},
      completedAt: parsed.completedAt ?? {},
      introduction: parsed.introduction ?? [],
    };
  } catch {
    return defaultState;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // One-time sync from localStorage after mount, so SSR/client hydration match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    // Debounced sync to localStorage whenever state changes (autosave).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveStatus("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStatus("saved");
    }, 350);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [state, hydrated]);

  const updateProfile = useCallback((patch: Partial<CandidateProfile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const updateAvailability = useCallback((patch: Partial<Availability>) => {
    setState((prev) => ({
      ...prev,
      availability: { ...prev.availability, ...patch },
    }));
  }, []);

  const addIntroItem = useCallback((item: Omit<IntroItem, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      introduction: [
        ...prev.introduction,
        { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
      ],
    }));
  }, []);

  const removeIntroItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      introduction: prev.introduction.filter((item) => item.id !== id),
    }));
  }, []);

  const completeNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      progress: { ...prev.progress, [nodeId]: "completed" as NodeStatus },
      completedAt: { ...prev.completedAt, [nodeId]: Date.now() },
    }));
  }, []);

  const submitJourney = useCallback(() => {
    setState((prev) => ({ ...prev, submitted: true, submittedAt: Date.now() }));
  }, []);

  const resetAll = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      saveStatus,
      updateProfile,
      updateAvailability,
      addIntroItem,
      removeIntroItem,
      completeNode,
      submitJourney,
      resetAll,
    }),
    [
      state,
      saveStatus,
      updateProfile,
      updateAvailability,
      addIntroItem,
      removeIntroItem,
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
