"use client";

import type { NodeProps } from "@xyflow/react";
import { BranchIcon } from "@/components/icons/BranchIcon";
import type { BranchId } from "@/lib/types";

export interface LaneHeaderData {
  branchId: BranchId;
  name: string;
  color: string;
  done: number;
  total: number;
  pct: number;
  [key: string]: unknown;
}

export function LaneHeaderNode({ data }: NodeProps) {
  const d = data as LaneHeaderData;

  return (
    <div className="flex w-[168px] flex-col items-center gap-2 select-none">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: `${d.color}26`, color: d.color }}
      >
        <BranchIcon branch={d.branchId} className="h-4.5 w-4.5" />
      </span>
      <p className="text-center text-[11px] font-semibold leading-tight text-ink">
        {d.name}
      </p>
      <div className="flex w-full items-center gap-1.5">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-raised">
          <span
            className="block h-full rounded-full transition-all duration-500"
            style={{ width: `${d.pct}%`, background: d.color }}
          />
        </span>
        <span className="shrink-0 text-[9px] text-muted">
          {d.done}/{d.total}
        </span>
      </div>
    </div>
  );
}
