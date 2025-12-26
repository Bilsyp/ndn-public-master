"use client";

import { useStatsStore } from "@/store";
import { TbClock } from "react-icons/tb";

const formatMs = (seconds) => {
  if (seconds == null || seconds <= 0) return "—";
  return `${(seconds * 1000).toFixed(0)} ms`;
};

export default function LoadLatencyInfo() {
  const loadLatency = useStatsStore((s) => s.stats.loadLatency);
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <TbClock size={14} className="text-slate-500" />
      <span className="font-medium">Load latency</span>
      <span className="text-slate-400">·</span>
      <span className="font-semibold text-slate-700">
        {formatMs(loadLatency[0])}
      </span>
    </div>
  );
}
