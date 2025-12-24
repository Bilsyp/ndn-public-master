"use client";
import ShakaPlayer from "@/features/Video/UseShakaPlayer";
const Player = () => {
  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Video Card */}
      <ShakaPlayer />
      {/* Source Selector */}
      <div className="rounded-lg border bg-white px-3 py-2 shadow-sm">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Stream Source
        </label>

        <select className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd">
            Bunny Streaming Demo (DASH)
          </option>
          <option value="https://dash.akamaized.net/akamai/test/caption_test/ElephantsDream/elephants_dream_480p_heaac5_1_https.mpd">
            Elephants Dream (DASH + Captions)
          </option>
        </select>
      </div>
    </div>
  );
};

export default Player;
