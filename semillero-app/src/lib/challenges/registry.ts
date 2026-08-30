import type { ChallengeProgressDefinition } from "@/lib/challenges/progress";
import {
  ELECTRONICS_CHALLENGE_NODE_IDS,
  ELECTRONICS_CHALLENGE_PROGRESS,
  getElectronicsChallengeProgressDefinition,
} from "@/lib/challenges/electronics/registry";
import {
  MECHANICS_CHALLENGE_NODE_IDS,
  MECHANICS_CHALLENGE_PROGRESS,
  getMechanicsChallengeProgressDefinition,
} from "@/lib/challenges/mechanics/registry";
import {
  SYSTEMS_CHALLENGE_NODE_IDS,
  SYSTEMS_CHALLENGE_PROGRESS,
  getSystemsChallengeProgressDefinition,
} from "@/lib/challenges/systems/registry";

export const IMPLEMENTED_CHALLENGE_NODE_IDS = [
  "D0",
  ...ELECTRONICS_CHALLENGE_NODE_IDS,
  ...MECHANICS_CHALLENGE_NODE_IDS,
  ...SYSTEMS_CHALLENGE_NODE_IDS,
] as const;

export const IMPLEMENTED_CHALLENGE_PROGRESS: Readonly<
  Record<string, ChallengeProgressDefinition>
> = {
  D0: {
    nodeId: "D0",
    stepIds: ["submission"],
    maximumHintsByStep: { submission: 0 },
  },
  ...ELECTRONICS_CHALLENGE_PROGRESS,
  ...MECHANICS_CHALLENGE_PROGRESS,
  ...SYSTEMS_CHALLENGE_PROGRESS,
};

export function getChallengeProgressDefinition(
  nodeId: string
): ChallengeProgressDefinition | null {
  if (nodeId === "D0") return IMPLEMENTED_CHALLENGE_PROGRESS.D0;
  return (
    getElectronicsChallengeProgressDefinition(nodeId) ??
    getMechanicsChallengeProgressDefinition(nodeId) ??
    getSystemsChallengeProgressDefinition(nodeId)
  );
}

export function isImplementedChallengeNodeId(nodeId: string): boolean {
  return Boolean(getChallengeProgressDefinition(nodeId));
}
