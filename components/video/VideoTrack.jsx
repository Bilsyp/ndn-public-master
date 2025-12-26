"use client";

import { useStatsStore } from "@/store";
import { TbCheck, TbVideo, TbChevronUp } from "react-icons/tb";
import { useState } from "react";

const bpsToMbps = (bps, precision = 2) =>
  bps ? (bps / 1_000_000).toFixed(precision) : "0";

export default function VideoTrack() {
  const videoTrack = useStatsStore((s) => s.stats.videoTrack);
  const [open, setOpen] = useState(false);

  if (!Array.isArray(videoTrack) || videoTrack.length === 0) {
    return (
      <div className="rounded-lg border bg-slate-50 px-4 py-3 text-xs text-slate-500">
        No video track data available
      </div>
    );
  }

  const activeTrack = videoTrack.find((t) => t.active);

  return (
    <div className="relative w-full max-w-sm">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex w-full items-center justify-between rounded-lg border
          bg-white px-3 py-2 text-xs font-semibold text-slate-700
          transition hover:bg-slate-50
        "
      >
        <div className="flex items-center gap-2">
          <TbVideo size={14} />
          <span>
            Video Track
            {activeTrack && (
              <span className="ml-1 text-slate-400">
                · {bpsToMbps(activeTrack.bandwidth)} Mbps
              </span>
            )}
          </span>
        </div>

        <TbChevronUp
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Drop-up Panel */}
      {open && (
        <div
          className="
            absolute bottom-full left-0 z-20 mb-2
            w-full max-h-64 space-y-2 overflow-y-auto
            rounded-xl border bg-white p-2 shadow-lg
          "
        >
          {videoTrack.map((item, idx) => {
            const isActive = item.active;

            return (
              <div
                key={`${item.bandwidth}-${idx}`}
                className={`
                  flex items-center justify-between rounded-lg border px-3 py-2
                  ${
                    isActive
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {isActive && (
                    <TbCheck size={14} className="text-emerald-600" />
                  )}
                  <span className="text-sm font-medium text-slate-800">
                    {bpsToMbps(item.bandwidth)} Mbps
                  </span>
                </div>

                <span
                  className={`
                    rounded-full px-2 py-0.5 text-[10px] font-semibold
                    ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {isActive ? "ACTIVE" : "AVAILABLE"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
