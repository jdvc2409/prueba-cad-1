import { BRANCH_ORDER } from "@/lib/data/branches";
import { ALL_NODES, IR_NODE } from "@/lib/data/nodes";
import type { BranchId } from "@/lib/types";

const RING_BASE = 210;
const RING_GAP = 118;
const IR_RADIUS_EXTRA = 150;

function branchAngleDeg(branchId: BranchId): number {
  const index = BRANCH_ORDER.indexOf(branchId);
  const step = 360 / BRANCH_ORDER.length;
  return -90 + index * step;
}

function offsetAngleDeg(depth: number): number {
  const base = 20;
  return base / (1 + depth * 0.55);
}

export interface NodePosition {
  x: number;
  y: number;
  angleDeg: number;
  radius: number;
}

export function layoutPositions(): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};

  for (const node of ALL_NODES) {
    if (node.id === IR_NODE.id) continue;
    const baseAngle = branchAngleDeg(node.branchId);
    const spread = offsetAngleDeg(node.depth) * node.offset;
    const angleDeg = baseAngle + spread;
    const radius = RING_BASE + node.depth * RING_GAP;
    const rad = (angleDeg * Math.PI) / 180;
    positions[node.id] = {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
      angleDeg,
      radius,
    };
  }

  const maxDepth = Math.max(...ALL_NODES.filter((n) => n.id !== IR_NODE.id).map((n) => n.depth));
  const irRadius = RING_BASE + maxDepth * RING_GAP + IR_RADIUS_EXTRA;
  const irAngle = 90;
  const irRad = (irAngle * Math.PI) / 180;
  positions[IR_NODE.id] = {
    x: Math.cos(irRad) * irRadius,
    y: Math.sin(irRad) * irRadius,
    angleDeg: irAngle,
    radius: irRadius,
  };

  return positions;
}
