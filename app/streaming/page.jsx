import Player from "@/components/video/Player";
import RoouterConnection from "@/features/Connection/RoouterConnection";
const page = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* MAIN CONTENT - LEFT */}
      <main className="col-span-12 xl:col-span-7 space-y-6">
        <Player />
        {/* <PlayerConfig /> */}
        {/* <QoEGraphs /> */}
      </main>

      {/* SIDE PANEL - RIGHT */}
      <aside className="col-span-12 xl:col-span-5 space-y-4">
        {/* <VideoPlaylist /> */}
        {/* <CardConnection /> */}
        {/* <StreamMeta /> */}
      </aside>
    </div>
  );
};

export default page;
