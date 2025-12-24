import { create } from "zustand";

const useUrl = create((set) => ({
  url: "",
  setUrl: (url) => set({ url }),
}));
const usePlayer = create((set) => ({
  player: undefined,
  setPlayer: (player) => set({ player }),
}));

// batas maksimal data biar gak infinite

// 🎯 Biar gak ngulang, define initial stat structure
const initialStats = {
  width: [],
  height: [],
  streamBandwidth: [],
  decodedFrames: [],
  droppedFrames: [],
  corruptedFrames: [],
  estimatedBandwidth: [],
  gapsJumped: [],
  stallsDetected: [],
  completionPercent: [],
  loadLatency: [],
  manifestTimeSeconds: [],
  drmTimeSeconds: [],
  playTime: [],
  pauseTime: [],
  bufferingDurations: [],
  bufferingTime: [],
  licenseTime: [],
  liveLatency: [],
  maxSegmentDuration: [],
  manifestSizeBytes: [],
  bytesDownloaded: [],
  nonFatalErrorCount: [],
  manifestPeriodCount: [],
  manifestGapCount: [],
  switchHistory: [],
  stateHistory: [],
  rtt_ms: [],
  jitter_ms: [],
};

export const useStatsStore = create((set, get) => ({
  stats: { ...initialStats },

  // ⚙️ Nambah banyak sekaligus
  setStats: (newStats) => {
    const prev = get().stats;
    const updated = {};

    for (const key in newStats) {
      updated[key] = [...(prev[key] || []), newStats[key]];
    }

    set({ stats: { ...prev, ...updated } });
  },

  // 🧩 Update satu field aja
  updateStat: (key, value) => {
    const prev = get().stats[key] || [];
    set({
      stats: {
        ...get().stats,
        [key]: [...prev, value], // 🚀 no slicing, no limit
      },
    });
  },
  incStall: () => {
    set((state) => ({
      stats: {
        ...state.stats,
        stallsDetected: [
          ...state.stats.stallsDetected,
          state.stats.stallsDetected.length + 1,
        ],
      },
    }));
  },

  // 🧼 Reset semua data jadi kosong
  resetStats: () => set({ stats: { ...initialStats } }),
}));

export { usePlayer, useUrl, useStatsStore };
