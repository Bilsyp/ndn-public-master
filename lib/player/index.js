import { NdnPlugin } from "../ndn/ndnPlugin";
export class playerManager {
  constructor(videoContainer, videoElement, shaka, statsStore) {
    // allow using playerManager without a real statsStore (no-op)
    this.statsStore =
      statsStore ?? // minimal shape expected by class: getState()-> { updateStat, stats }
      {
        getState: () => ({
          updateStat: () => {},
          stats: {},
        }),
      };
    this.videoContainer = videoContainer;
    this.videoElement = videoElement;
    this.shaka = shaka;
    this.player = null;
    this.bufferingStart = null;
    this.ui = null;
    this.controls = null;
    this.statsInterval = null;

    // bind handlers so we can remove them later
    this._onBuffering = (e) => this._handleBuffering(e);
    this._onDownloadHeaders = (event) => this._handleDownloadHeaders(event);
    this._statsTick = () => this._handleStatsTick();
  }
  init() {
    this.player = new this.shaka.Player(this.videoElement);
    this.ui = new this.shaka.ui.Overlay(
      this.player,
      this.videoContainer,
      this.videoElement
    );

    // register bound handlers
    this.player.addEventListener("buffering", this._onBuffering);
    this.player.addEventListener(
      "downloadheadersreceived",
      this._onDownloadHeaders
    );

    this.controls = this.ui.getControls();
    this.registerHttpPlugin();
    this.registerNdnPlugin();

    const net = this.player.getNetworkingEngine();
    net.registerResponseFilter((type, response) => {
      // only process segment responses
      if (type !== this.shaka.net.NetworkingEngine.RequestType.SEGMENT) return;
      const hdr = response.headers?.["__ndnMetrics"];
      const timeMs = hdr?.timeMs ?? response.timeMs;
      const size = hdr?.size ?? response.data?.byteLength ?? 0;
      const retryCount = hdr?.retryCount ?? 0;
      const segCount = hdr?.segCount ?? hdr?.estimatedSegCount ?? 0;
      if (timeMs && size) {
        window.__NDN_LAST_METRICS__ = {
          timeMs,
          size,
          retryCount,
          segCount,
          ts: Date.now(),
        };
      }
    });

    // 🧠 Ambil akses ke store biar gak getState() berulang
    const { updateStat } = this.statsStore.getState();
    this.updateStat = updateStat;

    // 🚀 Update tiap 1 detik
    this.statsInterval = setInterval(this._statsTick, 1000);

    // Optional: bersihin interval kalau player di-destroy
    this.videoElement.addEventListener("ended", () =>
      clearInterval(this.statsInterval)
    );
    // this.videoElement.addEventListener("emptied", () =>
    //   clearInterval(this.statsInterval)
    // );

    return this.player.attach(this.videoElement);
  }
  load(src) {
    if (src == "") return;
    return this.player.load(src);
  }
  getplayer() {
    return this.getPlayer();
  }
  getPlayer() {
    return this.player;
  }
  destroy() {
    // stop interval
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
    // remove event listeners
    if (this.player) {
      this.player.removeEventListener("buffering", this._onBuffering);
      this.player.removeEventListener(
        "downloadheadersreceived",
        this._onDownloadHeaders
      );
    }
    try {
      if (this.ui) this.ui.destroy();
    } catch (e) {
      // ignore
    }
    try {
      if (this.player) this.player.destroy();
    } catch (e) {
      // ignore
    }
    // clear refs
    this.player = null;
    this.ui = null;
    this.controls = null;
  }
  _handleBuffering(e) {
    const now = Date.now();
    if (e.buffering) {
      this.bufferingStart = now;
      return;
    }
    if (this.bufferingStart !== null) {
      const duration = (now - this.bufferingStart) / 1000; // detik
      this.updateStat?.("bufferingDurations", duration);
      this.bufferingStart = null;
    }
  }
  _handleDownloadHeaders(event) {
    const req = event.request;
    const start = req?.requestStartTime;
    if (!start) return;
    const end = Date.now();
    const { stats = {} } = this.statsStore.getState() || {};
    const prev = stats.rtt_ms?.at?.(-1);
    const rtt = end - start;
    this.updateStat?.("rtt_ms", rtt);
    if (prev !== undefined) {
      const jitter = Math.abs(rtt - prev);
      this.updateStat?.("jitter_ms", jitter);
    }
  }
  _handleStatsTick() {
    if (!this.player) return;
    const playerStats = this.player.getStats();
    const toMBps = (bps) => (bps / 1_000_000).toFixed(2);
    this.updateStat?.("decodedFrames", Number(playerStats.decodedFrames) || 0);
    this.updateStat?.("droppedFrames", Number(playerStats.droppedFrames) || 0);
    this.updateStat?.(
      "estimatedBandwidth",
      toMBps(Number(playerStats.estimatedBandwidth)) || 0
    );
    this.updateStat?.(
      "streamBandwidth",
      toMBps(Number(playerStats.streamBandwidth)) || 0
    );
  }
  registerHttpPlugin() {
    if (!this.shaka?.net?.HttpFetchPlugin?.isSupported?.()) return;
    this.shaka.net.NetworkingEngine.registerScheme(
      "http",
      this.shaka.net.HttpFetchPlugin.parse,
      this.shaka.net.NetworkingEngine.PluginPriority.PREFERRED,
      /* progressSupport= */ true
    );
  }
  registerNdnPlugin() {
    this.shaka.net.NetworkingEngine.registerScheme(
      "ndn",
      NdnPlugin,
      this.shaka.net.NetworkingEngine.PluginPriority.PREFERRED,
      true
    );
  }
}
