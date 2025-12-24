"use client";
import { playerManager } from "@/lib/player";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useStatsStore } from "@/store";
export default function ShakaPlayer() {
  const videoElement = useRef(null);
  const videoContainer = useRef(null);
  const { stats, updateStat } = useStatsStore();
  const initialized = async (shaka) => {
    if (shaka.Player.isBrowserSupported()) {
      shaka.polyfill.installAll();
      const ms = new playerManager(
        videoContainer.current,
        videoElement.current,
        shaka,
        updateStat,
        stats
      );
      await ms.init();
      await ms.load(
        "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
      );
    }

    //
    //   const localPlayer = new shaka.Player();
    //   const ui = new shaka.ui.Overlay(
    //     localPlayer,
    //     videoContainer.current,
    //     videoElement.current
    //   );
    //   ui.configure({
    //     castReceiverAppId: "07AEE832",
    //     castAndroidReceiverCompatible: true,
    //     seekBarColors: {
    //       base: "rgba(255, 255, 255, 0.3)",
    //       buffered: "rgba(255, 255, 255, 0.54)",
    //       played: "red",
    //     },
    //   });
    //   await localPlayer.attach(videoElement.current);
    //   await localPlayer.load(
    //     "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
    //   );
    // }
  };
  // console.log(stats);
  // "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border bg-black shadow-sm">
        <div className="aspect-video" ref={videoContainer}>
          <video className="h-full w-full object-cover" ref={videoElement} />
        </div>
      </div>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.16.3/shaka-player.ui.min.js"
        onLoad={() => {
          if (window.shaka) {
            initialized(window.shaka);
          }
        }}
      />
    </div>
  );
}
