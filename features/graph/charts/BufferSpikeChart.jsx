"use client";

import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStatsStore } from "@/store";
import { TbActivity } from "react-icons/tb";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BufferSpikeChart({ title = "Buffer Spikes" }) {
  const bufferingDurations = useStatsStore((s) => s.stats.bufferingDurations);
  const chartRef = useRef(null);
  const data = {
    labels: bufferingDurations.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Buffer Duration (ms)",
        data: bufferingDurations,
        backgroundColor: "rgba(245, 158, 11, 0.5)", // amber-500
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a", // slate-900
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b", // slate-500
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
        grid: {
          color: "#e5e7eb", // slate-200
        },
      },
    },
  };

  useEffect(() => {
    const c = chartRef.current;
    return () => c?.destroy?.();
  }, []);

  return (
    <div className="space-y-2 rounded-xl my-3  border border-white bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <TbActivity size={14} />
        <span>{title}</span>
      </div>
      {/* Chart */}
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}
