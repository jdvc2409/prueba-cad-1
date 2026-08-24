export type BranchId =
  | "design"
  | "mechanics"
  | "electronics"
  | "control"
  | "software"
  | "ai"
  | "systems";

export type NodeCategory =
  | "fundamentos"
  | "sub"
  | "aplicacion"
  | "profundizacion"
  | "critica"
  | "libre";

export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
}

export interface SkillNodeDef {
  id: string;
  branchId: BranchId;
  depth: number;
  offset: number;
  title: string;
  category: NodeCategory;
  typeLabel: string;
  description: string;
  requires: string[];
}

export type NodeStatus = "locked" | "available" | "completed";

export interface CandidateProfile {
  fullName: string;
  email: string;
  program: string;
  semester: string;
  studentCode: string;
  github: string;
  linkedin: string;
  portfolio: string;
  website: string;
  instagram: string;
  consentData: boolean;
  consentFiles: boolean;
}

export type IntroItemType = "text" | "image" | "audio" | "video" | "file" | "link";

export interface IntroItem {
  id: string;
  type: IntroItemType;
  title: string;
  content: string;
  createdAt: number;
}

export interface Availability {
  hoursPerWeek: string;
  days: string[];
  modality: string;
  timeOfDay: string;
  commitment: string;
}

export interface AppState {
  profile: CandidateProfile;
  introduction: IntroItem[];
  availability: Availability;
  progress: Record<string, NodeStatus>;
  completedAt: Record<string, number>;
  submitted: boolean;
  submittedAt: number | null;
}
