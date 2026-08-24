"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/lib/state/AppStateContext";
import { ALL_NODES, APPLICATION_NODE_IDS, IR_NODE, SKILL_NODES, nodeById } from "@/lib/data/nodes";
import { BRANCHES, BRANCH_ORDER } from "@/lib/data/branches";
import { LANE_HEADER_Y, laneX, layoutPositions } from "@/lib/treeLayout";
import {
  branchCompletedCount,
  branchProgressPercent,
  branchesExplored,
  canFinishJourney,
  completedCount,
  computeAllStatuses,
} from "@/lib/unlock";
import { SkillNodeCard } from "@/components/tree/SkillNodeCard";
import { LaneHeaderNode } from "@/components/tree/LaneHeaderNode";
import { LaneEdge } from "@/components/tree/LaneEdge";
import { TravelerCard } from "@/components/tree/TravelerCard";
import { TreeHeader } from "@/components/tree/TreeHeader";
import { NodeDetailPanel } from "@/components/tree/NodeDetailPanel";
import type { BranchId } from "@/lib/types";

const nodeTypes = { skill: SkillNodeCard, laneHeader: LaneHeaderNode };
const edgeTypes = { lane: LaneEdge };

function TreeCanvas() {
  const { state, completeNode } = useAppState();
  const [overview, setOverview] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { fitView, setCenter } = useReactFlow();

  const positions = useMemo(() => layoutPositions(), []);
  const statuses = useMemo(() => computeAllStatuses(state.progress), [state.progress]);

  const visible = useMemo(() => {
    const set = new Set<string>();
    for (const node of ALL_NODES) {
      if (overview || statuses[node.id] !== "locked") set.add(node.id);
    }
    return set;
  }, [overview, statuses]);

  const flowNodes: Node[] = useMemo(() => {
    const laneHeaders: Node[] = BRANCH_ORDER.map((id) => {
      const branch = BRANCHES[id];
      const total = SKILL_NODES.filter((n) => n.branchId === id).length;
      const done = branchCompletedCount(state.progress, id);
      return {
        id: `lane-${id}`,
        type: "laneHeader",
        position: { x: laneX(id), y: LANE_HEADER_Y },
        draggable: false,
        selectable: false,
        data: {
          branchId: id,
          name: branch.name,
          color: branch.color,
          done,
          total,
          pct: branchProgressPercent(state.progress, id),
        },
      };
    });

    const skillNodes: Node[] = ALL_NODES.filter((n) => visible.has(n.id)).map((n) => ({
      id: n.id,
      type: "skill",
      position: positions[n.id],
      draggable: false,
      selectable: false,
      data: {
        def: n,
        status: statuses[n.id],
        dimmed: overview && statuses[n.id] === "locked",
        color: BRANCHES[n.branchId].color,
        isIR: n.id === IR_NODE.id,
        onOpen: setSelectedId,
      },
    }));

    return [...laneHeaders, ...skillNodes];
  }, [state.progress, positions, statuses, visible, overview]);

  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    for (const n of ALL_NODES) {
      if (n.id === IR_NODE.id || !visible.has(n.id)) continue;
      for (const reqId of n.requires) {
        if (!visible.has(reqId)) continue;
        edges.push({
          id: `${reqId}-${n.id}`,
          source: reqId,
          target: n.id,
          type: "lane",
          data: {
            x1: positions[reqId].x,
            y1: positions[reqId].y,
            x2: positions[n.id].x,
            y2: positions[n.id].y,
            color: BRANCHES[n.branchId].color,
            active: statuses[reqId] === "completed",
            dimmed: overview && statuses[n.id] === "locked",
            variant: "lane",
          },
        });
      }
    }

    if (visible.has(IR_NODE.id)) {
      for (const appId of APPLICATION_NODE_IDS) {
        if (!visible.has(appId)) continue;
        const appNode = nodeById(appId);
        if (!appNode) continue;
        edges.push({
          id: `feed-${appId}`,
          source: appId,
          target: IR_NODE.id,
          type: "lane",
          data: {
            x1: positions[appId].x,
            y1: positions[appId].y,
            x2: positions[IR_NODE.id].x,
            y2: positions[IR_NODE.id].y,
            color: BRANCHES[appNode.branchId].color,
            active: statuses[appId] === "completed",
            dimmed: overview && statuses[IR_NODE.id] === "locked",
            variant: "irfeed",
          },
        });
      }
    }

    return edges;
  }, [visible, positions, statuses, overview]);

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 60);
    return () => clearTimeout(t);
  }, [overview, fitView]);

  const selectedNode = selectedId ? nodeById(selectedId) ?? null : null;
  const selectedStatus = selectedId ? statuses[selectedId] : "locked";
  const prereqTitles = useMemo(() => {
    if (!selectedNode) return [];
    return selectedNode.requires
      .map((id) => nodeById(id)?.title)
      .filter((t): t is string => Boolean(t));
  }, [selectedNode]);

  const ready = canFinishJourney(state.progress);

  const handleComplete = useCallback(
    (id: string) => {
      completeNode(id);
    },
    [completeNode]
  );

  const handleJumpToLane = useCallback(
    (branchId: BranchId) => {
      setCenter(laneX(branchId), 260, { zoom: 0.85, duration: 600 });
    },
    [setCenter]
  );

  return (
    <div className="relative h-[calc(100vh-58px)] w-full bg-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4 sm:p-5">
        <TreeHeader
          progress={state.progress}
          overview={overview}
          onToggleOverview={() => setOverview((v) => !v)}
          onJumpToLane={handleJumpToLane}
          completedTotal={completedCount(state.progress)}
          branchesTotal={branchesExplored(state.progress)}
        />
      </div>

      <div className="pointer-events-none absolute bottom-5 left-4 z-10 sm:left-5">
        <TravelerCard
          name={state.profile.fullName}
          completed={completedCount(state.progress)}
          branches={branchesExplored(state.progress)}
          progress={state.progress}
        />
      </div>

      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.25}
        maxZoom={1.6}
      >
        <Background variant={BackgroundVariant.Dots} color="#123449" gap={28} size={1.4} />
        <Controls
          showInteractive={false}
          className="!bottom-6 !right-6 !left-auto !rounded-xl !border !border-line !bg-surface/90 [&>button]:!border-line [&>button]:!bg-surface [&>button]:!text-ink"
        />
      </ReactFlow>

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex justify-center sm:bottom-6"
          >
            <Link
              href="/perfil"
              className="pulse-glow pointer-events-auto rounded-full bg-gradient-to-r from-action to-cyan px-6 py-3 text-sm font-semibold text-ink shadow-2xl transition-transform hover:scale-105"
            >
              Finalizar mi recorrido →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <NodeDetailPanel
        node={selectedNode}
        status={selectedStatus}
        prereqTitles={prereqTitles}
        onClose={() => setSelectedId(null)}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default function SkillsPage() {
  return (
    <ReactFlowProvider>
      <TreeCanvas />
    </ReactFlowProvider>
  );
}
