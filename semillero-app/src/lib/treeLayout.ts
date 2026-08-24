import { BRANCH_ORDER } from "@/lib/data/branches";
import { ALL_NODES, IR_NODE } from "@/lib/data/nodes";
import type { BranchId } from "@/lib/types";

export const LANE_PITCH = 192;
export const TIER_HEIGHT = 132;
export const LANE_HEADER_Y = -120;
export const MAX_TIER = 6;

function laneIndex(branchId: BranchId): number {
  return BRANCH_ORDER.indexOf(branchId);
}

export function laneX(branchId: BranchId): number {
  const center = (BRANCH_ORDER.length - 1) / 2;
  return (laneIndex(branchId) - center) * LANE_PITCH;
}

export function tierY(depth: number): number {
  return depth * TIER_HEIGHT;
}

export interface NodePosition {
  x: number;
  y: number;
}

export function layoutPositions(): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};

  for (const node of ALL_NODES) {
    if (node.id === IR_NODE.id) continue;
    const x = laneX(node.branchId) + node.offset * 16;
    const y = tierY(node.depth) + (node.offset !== 0 ? node.offset * 30 : 0);
    positions[node.id] = { x, y };
  }

  positions[IR_NODE.id] = {
    x: 0,
    y: tierY(MAX_TIER) + TIER_HEIGHT + 110,
  };

  return positions;
}

export function laneBottomY(): number {
  return tierY(MAX_TIER) + TIER_HEIGHT / 2;
}
