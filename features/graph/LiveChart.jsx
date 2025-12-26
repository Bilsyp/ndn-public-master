"use client";
import "chartjs-adapter-date-fns";
import { BandwidthChart } from "./charts";
import BufferSpikeChart from "./charts/BufferSpikeChart";
import DroppedFrameChart from "./charts/DropFramesChart";
const LiveChart = () => {
  return (
    <div className=" p-4 rounded-2xl mt-4 shadow-xl">
      <BandwidthChart />
      <DroppedFrameChart />
      <BufferSpikeChart />
    </div>
  );
};

export default LiveChart;
