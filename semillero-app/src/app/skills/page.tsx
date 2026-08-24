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
import { ALL_NODES, IR_NODE, nodeById } from "@/lib/data/nodes";
import { BRANCHES } from "@/lib/data/branches";
import { layoutPositions } from "@/lib/treeLayout";
import {
  branchesExplored,
  canFinishJourney,
  completedCount,
  computeAllStatuses,
} from "@/lib/unlock";
import { CandidateNode } from "@/components/tree/CandidateNode";
import { SkillNodeCard } from "@/components/tree/SkillNodeCard";
import { RadialEdge } from "@/components/tree/RadialEdge";
import { NodeDetailPanel } from "@/components/tree/NodeDetailPanel";

const nodeTypes = { candidate: CandidateNode, skill: SkillNodeCard };
const edgeTypes = { radial: RadialEdge };

function TreeCanvas() {
  const { state, completeNode } = useAppState();
  const [overview, setOverview] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { fitView } = useReactFlow();

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
    const candidate: Node = {
      id: "candidate",
      type: "candidate",
      position: { x: 0, y: 0 },
      draggable: false,
      selectable: false,
      data: {
        name: state.profile.fullName,
        completed: completedCount(state.progress),
        branches: branchesExplored(state.progress),
        ready: canFinishJourney(state.progress),
      },
    };

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

    return [candidate, ...skillNodes];
  }, [state.profile.fullName, state.progress, positions, statuses, visible, overview]);

  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    const center = { x: 0, y: 0 };

    for (const n of ALL_NODES) {
      if (!visible.has(n.id)) continue;

      if (n.id === IR_NODE.id) {
        edges.push({
          id: `candidate-${n.id}`,
          source: "candidate",
          target: n.id,
          type: "radial",
          data: {
            x1: center.x,
            y1: center.y,
            x2: positions[n.id].x,
            y2: positions[n.id].y,
            dimmed: overview && statuses[n.id] === "locked",
          },
        });
        continue;
      }

      if (n.requires.length === 0) {
        edges.push({
          id: `candidate-${n.id}`,
          source: "candidate",
          target: n.id,
          type: "radial",
          data: {
            x1: center.x,
            y1: center.y,
            x2: positions[n.id].x,
            y2: positions[n.id].y,
            dimmed: overview && statuses[n.id] === "locked",
          },
        });
      } else {
        for (const reqId of n.requires) {
          if (!visible.has(reqId)) continue;
          edges.push({
            id: `${reqId}-${n.id}`,
            source: reqId,
            target: n.id,
            type: "radial",
            data: {
              x1: positions[reqId].x,
              y1: positions[reqId].y,
              x2: positions[n.id].x,
              y2: positions[n.id].y,
              dimmed: overview && statuses[n.id] === "locked",
            },
          });
        }
      }
    }
    return edges;
  }, [visible, positions, statuses, overview]);

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 60);
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

  return (
    <div className="relative h-[calc(100vh-58px)] w-full bg-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-xs text-muted backdrop-blur">
          <span className="font-semibold text-ink">
            {completedCount(state.progress)}
          </span>{" "}
          nodos completados ·{" "}
          <span className="font-semibold text-ink">
            {branchesExplored(state.progress)}
          </span>{" "}
          ramas exploradas
        </div>

        <button
          onClick={() => setOverview((v) => !v)}
          className="pointer-events-auto rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-xs font-medium text-ink backdrop-blur transition-colors hover:border-tech"
        >
          {overview ? "Ver mi progreso" : "Ver árbol completo"}
        </button>
      </div>

      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
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
          className="!bottom-6 !left-6 !rounded-xl !border !border-line !bg-surface/90 [&>button]:!border-line [&>button]:!bg-surface [&>button]:!text-ink"
        />
      </ReactFlow>

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
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
