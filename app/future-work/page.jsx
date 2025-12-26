"use client";

import dynamic from "next/dynamic";
import { options, graph } from "@/lib/topologi/config";
const Graph = dynamic(() => import("react-vis-network-graph"), {
  ssr: false,
});

export default function TopologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Streaming Network Topology
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Experimental topology for video streaming using Named Data Networking
          (NDN). Multiple clients request the same video source through
          different core nodes.
        </p>
      </header>

      {/* Graph Card */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="h-[520px]">
          <Graph graph={graph} options={options} />
        </div>
      </div>
    </div>
  );
}
