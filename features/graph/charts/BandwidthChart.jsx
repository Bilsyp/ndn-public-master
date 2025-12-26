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
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import streamingPlugin from "chartjs-plugin-streaming";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  streamingPlugin
);

const BandwidthChart = () => {
  const { stats } = useStatsStore();
  const chartRef = useRef(null);

  const data = useRef({
    datasets: [
      {
        label: "Stream Bandwidth (Mbps)",
        borderColor: "#F59E0B", // amber-500
        backgroundColor: "rgba(245,158,11,0.15)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
        data: [],
      },
      {
        label: "Estimated Bandwidth (Mbps)",
        borderColor: "#10B981", // emerald-500
        backgroundColor: "rgba(16,185,129,0.15)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
        data: [],
      },
    ],
  });

  const options = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#334155", // slate-700
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Bandwidth Monitoring",
        color: "#0F172A", // slate-900
        font: {
          size: 14,
          weight: "600",
        },
      },
    },
    scales: {
      x: {
        type: "realtime",
        grid: {
          color: "rgba(148,163,184,0.15)", // slate-400 soft
        },
        ticks: {
          color: "#64748B", // slate-500
        },
        realtime: {
          duration: 20000,
          refresh: 1000,
          delay: 2000,
          onRefresh(chart) {
            const now = Date.now();

            chart.data.datasets[0].data.push({
              x: now,
              y: stats.streamBandwidth.at(-1),
            });

            chart.data.datasets[1].data.push({
              x: now,
              y: stats.estimatedBandwidth.at(-1),
            });
          },
        },
      },
      y: {
        grid: {
          color: "rgba(148,163,184,0.15)",
        },
        ticks: {
          color: "#64748B",
        },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    return () => chart.destroy?.();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="h-64">
        <Line ref={chartRef} data={data.current} options={options} />
      </div>
    </div>
  );
};

export default BandwidthChart;
