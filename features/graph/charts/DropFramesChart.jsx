"use client";

import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useStatsStore } from "@/store";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import streamingPlugin from "chartjs-plugin-streaming";
import { TbAlertTriangle } from "react-icons/tb";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  streamingPlugin
);

export default function DroppedFrameChart() {
  const droppedFrames = useStatsStore((s) => s.stats.droppedFrames);

  const chartRef = useRef(null);

  // data harus stabil antar render
  const dataRef = useRef({
    datasets: [
      {
        label: "Dropped Frames",
        data: [],
        borderColor: "rgb(244, 63, 94)", // rose-500
        backgroundColor: "rgba(244, 63, 94, 0.15)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
      },
    },
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 20000,
          refresh: 1000,
          delay: 2000,
          onRefresh(chart) {
            const now = Date.now();
            const value = droppedFrames.at(-1) ?? 0;

            chart.data.datasets[0].data.push({
              x: now,
              y: value,
            });
          },
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    return () => chart?.destroy?.();
  }, []);

  return (
    <div className="space-y-2 rounded-xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <TbAlertTriangle size={14} className="text-rose-500" />
        <span>Dropped Frames</span>
      </div>

      {/* Chart */}
      <Line ref={chartRef} data={dataRef.current} options={options} />
    </div>
  );
}
