import {
  ELECTRONICS_CHALLENGE_NODE_IDS,
  getElectronicsChallengeProgressDefinition,
  isElectronicsChallengeNodeId,
} from "@/lib/challenges/electronics/registry";
import {
  MECHANICS_CHALLENGE_NODE_IDS,
  getMechanicsChallengeProgressDefinition,
  isMechanicsChallengeNodeId,
} from "@/lib/challenges/mechanics/registry";
import type { ChallengeProgressDefinition } from "@/lib/challenges/progress";

/**
 * Combines every branch's detailed-challenge registry into one lookup, so
 * app-wide state (AppStateContext, NodeDetailPanel) doesn't need to know how
 * many branches have detailed challenges implemented.
 */
export const DETAILED_CHALLENGE_NODE_IDS: readonly string[] = [
  ...ELECTRONICS_CHALLENGE_NODE_IDS,
  ...MECHANICS_CHALLENGE_NODE_IDS,
];

export function isDetailedChallengeNodeId(nodeId: string): boolean {
  return isElectronicsChallengeNodeId(nodeId) || isMechanicsChallengeNodeId(nodeId);
}

export function getChallengeProgressDefinition(
  nodeId: string
): ChallengeProgressDefinition | null {
  return (
    getElectronicsChallengeProgressDefinition(nodeId) ??
    getMechanicsChallengeProgressDefinition(nodeId)
  );
}
