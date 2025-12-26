"use client";

import { usePlayerConfigStore } from "@/store";
import Image from "next/image";

const STREAM_SOURCES = [
  {
    id: "bbb",
    title: "Big Buck Bunny",
    protocol: "http",
    description: "Animated short film · DASH · 30 FPS",
    thumbnail:
      "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    source: {
      url: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
      streamType: "dash",
    },
  },

  {
    id: "spiderman",
    title: "Spiderman vs Doctor Strange",
    protocol: "ndn",
    description: "Fantasy short film · DASH",
    thumbnail: "/spider.jpg",
    source: {
      url: "ndn:/test/spiderman/playlist.mpd",
      streamType: "dash",
    },
  },
];

export default function StreamSourceList() {
  const currentSource = usePlayerConfigStore((s) => s.config.source);
  const setSource = usePlayerConfigStore((s) => s.setSource);

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        Stream Source
      </p>

      {STREAM_SOURCES.map((item) => {
        const isActive = currentSource?.url === item.source.url;

        return (
          <button
            key={item.id}
            onClick={() => setSource(item.source)}
            className={`
              group flex w-full gap-3 rounded-xl border p-3 text-left transition
              ${
                isActive
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400/40"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }
            `}
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-32 overflow-hidden rounded-lg">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="128px"
                className={`
                  object-cover transition
                  ${isActive ? "" : "group-hover:brightness-95"}
                `}
                priority={isActive}
              />

              {/* Overlay */}
              <div
                className={`
                  absolute inset-0 flex items-center justify-center
                  bg-black/30 text-xs font-semibold text-white
                  transition
                  ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }
                `}
              >
                ▶
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <h3
                className={`text-sm font-semibold ${
                  isActive ? "text-indigo-700" : "text-slate-800"
                }`}
              >
                {item.title}
              </h3>

              <p className="text-xs text-slate-500">{item.description}</p>

              {/* Protocol hint (optional but useful) */}
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {item.protocol}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
