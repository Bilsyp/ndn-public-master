import { create } from "zustand";
import { ABR_ALGORITHMS } from "@/features/player/configAbr";
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
  videoTrack: [],
  stateHistory: [],
  rtt_ms: [],
  jitter_ms: [],
};

export const useStatsStore = create((set, get) => ({
  stats: { ...initialStats },
  videoTrack: (track) => {
    set((state) => ({
      stats: {
        ...state.stats,
        videoTrack: track,
      },
    }));
  },
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
  // 🔄 Reset semua ke state awal
  resetStats: () => {
    set({ stats: { ...initialStats } });
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

const initialPlayerConfig = {
  abr: {
    algorithm: ABR_ALGORITHMS.THROUGHPUT_BASED.key,
  },
  source: null,
};

export const usePlayerConfigStore = create((set, get) => ({
  config: { ...initialPlayerConfig },

  // ⚙️ set banyak config
  setConfig: (newConfig) => {
    set({
      config: {
        ...get().config,
        ...newConfig,
      },
    });
  },

  // 🎬 set source
  setSource: (source) => {
    set({
      config: {
        ...get().config,
        source,
      },
    });
  },

  // 🧠 set ABR algorithm
  setAbrAlgorithm: (algorithmKey) => {
    set({
      config: {
        ...get().config,
        abr: {
          algorithm: algorithmKey,
        },
      },
    });
  },
  // 🔄 reset
  resetConfig: () => {
    set({ config: { ...initialPlayerConfig } });
  },
}));
export { usePlayer, useUrl, useStatsStore };
