import CardConnection from "@/components/ui/CardConnection";
import { connection } from "@/lib/ndn/ndnConnection";
const RoouterConnection = async ({ children }) => {
  const conn = await connection();
  if (conn.uplink == null || conn.routers == null) {
    return <div>Failed to connect to the NDN router.</div>;
  } else {
    const routers = conn.routers.map((item) => item.connect);
    const uplink = conn.uplink.router;
    console.log("Router connected:", routers);
    console.log("Uplink connected:", uplink);
    return (
      <div>
        <CardConnection routers={routers} uplink={uplink} />
        {children}
      </div>
    );
  }
};

export default RoouterConnection;
