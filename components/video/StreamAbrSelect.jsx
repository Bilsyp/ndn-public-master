"use client";

import { ABR_ALGORITHMS } from "@/features/player/configAbr";
import { usePlayerConfigStore } from "@/store";
import { TbArrowsShuffle } from "react-icons/tb";

export default function AbrAlgorithmSelect() {
  const algorithm = usePlayerConfigStore((s) => s.config.abr.algorithm);
  const setAbrAlgorithm = usePlayerConfigStore((s) => s.setAbrAlgorithm);

  const algorithms = Object.values(ABR_ALGORITHMS);
  const activeAlgo = algorithms.find((a) => a.key === algorithm);

  return (
    <div className="space-y-1">
      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <TbArrowsShuffle size={14} />
        <span>ABR Algorithm</span>
      </div>

      {/* Select */}
      <select
        className="
          w-full rounded-lg border border-slate-200
          bg-white px-3 py-2 text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-slate-200
        "
        value={algorithm}
        onChange={(e) => setAbrAlgorithm(e.target.value)}
      >
        {algorithms.map((algo) => (
          <option key={algo.key} value={algo.key}>
            {algo.label} · {algo.category}
          </option>
        ))}
      </select>

      {/* Description */}
      {activeAlgo && (
        <p className="text-[11px] leading-snug text-slate-400">
          {activeAlgo.description}
        </p>
      )}
    </div>
  );
}
