import { BufferBased } from "../abr/BufferBased";
import { Hybrid } from "../abr/Hybrid";
import { FNN } from "../abr/NeuralNetworkFNN";
import { RateBase } from "../abr/RateBase";
import { NdnPlugin } from "../ndn/ndnPlugin";
import brainjs from "@/data/brainjs";

export class playerManager {
  constructor(
    videoContainer,
    videoElement,
    shaka,
    updateStat,
    statsStore,
    videoTrack
  ) {
    // allow using playerManager without a real statsStore (no-op)
    this.statsStore = statsStore;
    this.videoTrack = videoTrack;
    this.updateStat = updateStat;
    this.videoContainer = videoContainer;
    this.videoElement = videoElement;
    this.shaka = shaka;
    this.player = null;
    this.bufferingStart = null;
    this.ui = null;
    this.controls = null;
    this.statsInterval = null;
    this.buffer = null;

    // bind handlers so we can remove them later
    this._onBuffering = (e) => this._handleBuffering(e);
    // this._onDownloadHeaders = (event) => this._handleDownloadHeaders(event);
    this._statsTick = () => this._handleStatsTick();
  }
  async init() {
    this.player = new this.shaka.Player(this.videoElement);
    // register bound handlers
    this.player.addEventListener("buffering", this._onBuffering);
    // this.player.addEventListener(
    //   "downloadheadersreceived",
    //   this._onDownloadHeaders
    // );
    this.player.addEventListener("started", () => {
      this.statsInterval = setInterval(() => {
        this._handleStatsTick(this.player, this.updateStat);
      }, 1000);
    });
    this.registerHttpPlugin();
    this.registerNdnPlugin();
    this.videoElement.addEventListener("ended", () =>
      clearInterval(this.statsInterval)
    );
    this.videoElement.addEventListener("emptied", () =>
      clearInterval(this.statsInterval)
    );
    this.videoElement.addEventListener("timeupdate", () => {
      this.buffer = this.player?.getBufferFullness();
    });

    this.player.attach(this.videoElement);
  }
  load(src) {
    if (src == "") return;
    return this.player.load(src);
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
  test() {
    console.log(this.player);
  }
  async setAbrAlgorithm(algo) {
    if (this.player == undefined) {
      console.log("errors");
    } else {
      switch (algo) {
        case "rate_based":
          this.player.configure({
            abrFactory: () => new RateBase(),
            streaming: {
              bufferingGoal: 50,
            },
          });
          break;
        case "hybrid":
          this.player.configure({
            abrFactory: () => new Hybrid(this.player),
            streaming: {
              bufferingGoal: 80,
            },
          });
          break;
        case "buffer_based":
          this.player.configure({
            abrFactory: () => new BufferBased(this.player),
            streaming: {
              bufferingGoal: 80,
            },
          });
          break;
        case "neural_network":
          const model = await fetch("/api/model").then((res) => res.json());
          const net = new brainjs.NeuralNetwork();
          net.fromJSON(model);
          this.player.configure({
            abrFactory: () => new FNN(this.player, net),
          });
          break;
        case "Throughput Base":
          player.configure(
            "abrFactory",
            () => new this.shaka.abr.SimpleAbrManager()
          );
          break;
      }
    }

    // this.player.configure({
    //   abr: () => new RateBase(),
    // });
  }
  _handleDownloadHeaders(event) {
    // const req = event.request;
    // const start = req?.requestStartTime;
    // if (!start) return;
    // const end = Date.now();
    // const { stats = {} } = this.statsStore.getState() || {};
    // const prev = stats.rtt_ms?.at?.(-1);
    // const rtt = end - start;
    // this.updateStat?.("rtt_ms", rtt);
    // if (prev !== undefined) {
    //   const jitter = Math.abs(rtt - prev);
    //   this.updateStat?.("jitter_ms", jitter);
    // }
  }
  _handleStatsTick(player, updateStat) {
    // if (!this.player) return;
    const playerStats = player.getStats();
    const toMBps = (bps) => (bps / 1_000_000).toFixed(2);

    // updateStat("videoTrack", player.getVideoTracks());
    this.videoTrack(player.getVideoTracks());
    updateStat("loadLatency", Number(playerStats.loadLatency) || 0);

    updateStat("decodedFrames", Number(playerStats.decodedFrames) || 0);
    updateStat("droppedFrames", Number(playerStats.droppedFrames) || 0);
    updateStat(
      "estimatedBandwidth",
      toMBps(Number(playerStats.estimatedBandwidth)) || 0
    );
    updateStat(
      "streamBandwidth",
      toMBps(Number(playerStats.streamBandwidth)) || 0
    );
    // console.log("1");
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
