"use client";
import { playerManager } from "@/lib/player";
import { useRef, useEffect, useState } from "react";
import { useStatsStore } from "@/store";
import { usePlayerConfigStore } from "@/store";
import shaka from "shaka-player";
import { connection } from "@/lib/ndn/ndnConnection";
export default function ShakaPlayer() {
  const videoElement = useRef(null);
  const videoContainer = useRef(null);
  const managerRef = useRef(null); // 🔥 penting
  const [ready, setReady] = useState(false);
  const { stats, updateStat, resetStats, videoTrack } = useStatsStore();
  const source = usePlayerConfigStore((s) => s.config.source);
  const abrAlgorithm = usePlayerConfigStore((s) => s.config.abr.algorithm);
  async function conn() {
    try {
      await connection();
    } catch (error) {
      console.log("errors");
    }
  }
  /* ================================
   * 1️⃣ INIT PLAYER (ONCE)
   * ================================ */
  useEffect(() => {
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka Player not supported");
      return;
    }
    conn();
    shaka.polyfill.installAll();

    const manager = new playerManager(
      videoContainer.current,
      videoElement.current,
      shaka,
      updateStat,
      stats,
      videoTrack
    );

    manager.init();
    managerRef.current = manager;
    manager.test();
    return () => {
      manager.destroy?.();
      managerRef.current = null;
    };
  }, []);

  /* ================================
   * 2️⃣ LOAD SOURCE (SESSION CHANGE)
   * ================================ */
  useEffect(() => {
    if (!managerRef.current || !source) return;

    const load = async () => {
      resetStats(); // 🔄 session baru
      await managerRef.current.load(source.url);
    };

    load();
  }, [source]);

  /* ================================
   * 3️⃣ APPLY ABR (RUNTIME)
   * ================================ */
  useEffect(() => {
    if (!managerRef.current) return;
    managerRef.current.setAbrAlgorithm(abrAlgorithm);
  }, [abrAlgorithm]);

  return (
    <div className="relative w-full text-center  rounded-xl border bg-black shadow-sm">
      <div className="  bg-red-900 aspect-video " ref={videoContainer}>
        <video
          className="h-full w-full object-cover"
          controls={ready}
          preload="metadata"
          poster="/svg/cute.png"
          ref={videoElement}
          onLoadedMetadata={() => setReady(true)}
        />
      </div>
    </div>
  );
}
