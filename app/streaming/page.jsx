import LoadLatencyInfo from "@/components/video/LoadLatencyInfo";
import Player from "@/components/video/Player";
import ProtocolInfo from "@/components/video/ProtocoInfo";
import AbrAlgorithmSelect from "@/components/video/StreamAbrSelect";
import StreamSourceList from "@/components/video/StreamSourceSelect";
import VideoTrack from "@/components/video/VideoTrack";
import RoouterConnection from "@/features/Connection/RoouterConnection";

import LiveChart from "@/features/graph/LiveChart";
const page = () => {
  return (
    <div className="grid grid-cols-12 gap-6 p-3">
      {/* MAIN CONTENT - LEFT */}
      <main className="col-span-12 xl:col-span-7 space-y-6 p-3">
        <Player />
        <ProtocolInfo />
        <AbrAlgorithmSelect />
        <LoadLatencyInfo />
        <VideoTrack />
        {/* <PlayerConfig /> */}
        {/* <QoEGraphs /> */}
        <LiveChart />
      </main>

      {/* SIDE PANEL - RIGHT */}
      <aside className="col-span-12 xl:col-span-5 space-y-4">
        {/* <VideoPlaylist /> */}
        <RoouterConnection />
        <StreamSourceList />
        {/* <CardConnection /> */}

        {/* <StreamMeta /> */}
      </aside>
    </div>
  );
};

export default page;
