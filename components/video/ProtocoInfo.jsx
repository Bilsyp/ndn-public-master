"use client";

import { TbWorld, TbQuestionMark } from "react-icons/tb";
import { FaNetworkWired } from "react-icons/fa6";
import { usePlayerConfigStore } from "@/store";
const PROTOCOL_META = {
  http: {
    label: "HTTP Streaming",
    description: "Client–server based delivery",
    color: "text-slate-700",
    bg: "bg-slate-100",
    icon: TbWorld,
  },
  ndn: {
    label: "Named Data Networking",
    description: "Content-centric networking",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    icon: FaNetworkWired,
  },
  unknown: {
    label: "Unknown Protocol",
    description: "Protocol not recognized",
    color: "text-slate-500",
    bg: "bg-slate-50",
    icon: TbQuestionMark,
  },
};

const detectProtocol = (url = "") => {
  if (url.startsWith("ndn:/")) return "ndn";
  if (url.startsWith("http://") || url.startsWith("https://")) return "http";
  return "unknown";
};

export default function ProtocolInfo() {
  const source = usePlayerConfigStore((s) => s.config.source);
  const protocol = detectProtocol(source?.url);

  const meta = PROTOCOL_META[protocol];
  const Icon = meta.icon;

  return (
    <div
      className={`
        flex items-center gap-3 rounded-lg border border-slate-200
        px-3 py-2 text-xs
        ${meta.bg}
      `}
    >
      <Icon size={18} className={meta.color} />

      <div className="leading-tight">
        <p className={`font-semibold ${meta.color}`}>{meta.label}</p>
        <p className="text-[11px] text-slate-500">{meta.description}</p>
      </div>
    </div>
  );
}
