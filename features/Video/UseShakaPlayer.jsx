"use client";
import Script from "next/script";
import { useRef } from "react";

export default function ShakaPlayer() {
  const videoElement = useRef(null);
  const videoContainer = useRef(null);
  const initialized = async (shaka) => {
    if (shaka.Player.isBrowserSupported()) {
      console.log("Shaka Player is supported in this browser.");
      shaka.polyfill.installAll();
      const localPlayer = new shaka.Player();
      const ui = new shaka.ui.Overlay(
        localPlayer,
        videoContainer.current,
        videoElement.current
      );
      ui.configure({
        castReceiverAppId: "07AEE832",
        castAndroidReceiverCompatible: true,
        seekBarColors: {
          base: "rgba(255, 255, 255, 0.3)",
          buffered: "rgba(255, 255, 255, 0.54)",
          played: "red",
        },
      });
      await localPlayer.attach(videoElement.current);
      await localPlayer.load(
        "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
      );
    }
  };
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
