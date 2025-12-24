import { H3Transport } from "@ndn/quic-transport";
import { connectToRouter, fchQuery } from "@ndn/autoconfig";

export async function connection() {
  // https://testbed-ndn-rg.stei.itb.ac.id/
  const routerURL = "wss://testbed-ndn-rg.stei.itb.ac.id/ws/";
  try {
    const uplink = await connectToRouter(routerURL, {
      testConnection: false,
      H3Transport,
    });
    const router = await fchQuery();
    // console.log("Uplink established:", uplink);
    return {
      uplink,
      routers: router.routers,
    };
  } catch (error) {
    // console.log("Failed to establish uplink:", error);
    return {
      router: null,
      uplink: null,
    };
  }
}
