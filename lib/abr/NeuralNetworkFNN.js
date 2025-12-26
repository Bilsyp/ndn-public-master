import { EwmaBandwidthEstimator } from "../Ewma/EwmaBandwidthEstimator";
export class FNN {
  constructor(player, net) {
    this.player = player;
    this.net_ = net;
    this.switch_ = null;
    this.bandwidthEstimator_ = new EwmaBandwidthEstimator();
    this.enabled_ = false;
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.startupComplete_ = false;
    this.config_ = null;
    this.lastBufferLevel_ = 0;
    this.lastBandwidth_ = null;
    this.lowBuffer_ = 0.2;
    this.highBuffer_ = 0.8;
  }
  stop() {
    this.switch_ = null;
    this.enabled_ = false;
    this.lastBufferLevel_ = 0;
    this.lastBandwidth_ = null;
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.lastTimeChosenMs_ = null;
  }
  release() {
    this.stop();
  }
  normalizeBandwidth_(bw) {
    if (!bw || !Number.isFinite(bw)) return 0;
    const maxBw = 10_000_000; // 10 Mbps
    return Math.min(bw / maxBw, 1);
  }
  chooseVariant() {
    if (!Number.isFinite(this.lastBandwidth_)) {
      return this.variants_[0];
    }

    const bwNorm = this.normalizeBandwidth_(this.lastBandwidth_);
    const bufNorm = this.lastBuffer_;

    const output = this.net_.run({
      bw: bwNorm,
      buf: bufNorm,
    });

    const q = Math.min(Math.max(output.q ?? 0, 0), 1);
    const index = Math.floor(q * (this.variants_.length - 1));

    return this.variants_[index];
  }
  getBufferLevel() {
    return this.player.getBufferFullness(); // 0..1
  }
  setVariants(variants) {
    this.variants_ = variants;
  }
  configure(config) {
    this.config_ = config;
  }
  init(switchCallback) {
    this.switch_ = switchCallback;
  }
  enable() {
    this.enabled_ = true;
    if (this.variants_.length) {
      this.trySuggestStreams();
    }
  }
  disable() {
    this.enabled_ = false;
  }

  segmentDownloaded(deltaTimeMs, numBytes, allowSwitch, request, context) {
    if (!this.enabled_) return;

    this.lastBuffer_ = this.getBufferLevel();

    if (deltaTimeMs > 0 && numBytes > 0) {
      this.bandwidthEstimator_.sample(deltaTimeMs, numBytes);
      this.lastBandwidth_ = this.getBandwidthEstimate();
    }

    if (allowSwitch && Number.isFinite(this.lastBandwidth_)) {
      this.suggestStreams_();
    }
  }
  suggestStreams_() {
    if (!this.switch_ || !this.variants_.length) return;

    const bwNorm = this.normalizeBandwidth_(this.lastBandwidth_);
    const bufNorm = this.lastBuffer_;

    const output = this.net_.run({ bw: bwNorm, buf: bufNorm });

    let q = output?.q;

    if (!Number.isFinite(q)) {
      q = 0; // fallback aman
    }

    q = Math.min(Math.max(q, 0), 1);

    let index = Math.floor(q * (this.variants_.length - 1));

    // 🔒 FINAL GUARD
    index = Math.min(Math.max(index, 0), this.variants_.length - 1);

    const chosen = this.variants_[index];

    if (!chosen) {
      console.warn("ABR: chosen variant undefined", {
        q,
        index,
        variantsLength: this.variants_.length,
      });
      return;
    }

    this.switch_(chosen, false, 0);
  }

  trySuggestStreams() {
    if (this.enabled_) {
      this.lastTimeChosenMs_ = Date.now();
      this.suggestStreams_(/* force= */ true);
    }
  }
  getBandwidthEstimate() {
    const defaultBandwidthEstimate = this.getDefaultBandwidth_();
    if (
      navigator.connection &&
      navigator.connection.downlink &&
      this.config_.useNetworkInformation &&
      this.config_.preferNetworkInformationBandwidth
    ) {
      return defaultBandwidthEstimate;
    }
    const bandwidthEstimate = this.bandwidthEstimator_.getBandwidthEstimate(
      defaultBandwidthEstimate
    );
    if (this.cmsdManager_) {
      return this.cmsdManager_.getBandwidthEstimate(bandwidthEstimate);
    }
    return bandwidthEstimate;
  }
  getDefaultBandwidth_() {
    let defaultBandwidthEstimate = this.config_.defaultBandwidthEstimate;
    // Some browsers implement the Network Information API, which allows
    // retrieving information about a user's network connection.  Tizen 3 has
    // NetworkInformation, but not the downlink attribute.
    if (
      navigator.connection &&
      navigator.connection.downlink &&
      this.config_.useNetworkInformation
    ) {
      // If it's available, get the bandwidth estimate from the browser (in
      // megabits per second) and use it as defaultBandwidthEstimate.
      defaultBandwidthEstimate = navigator.connection.downlink * 1e6;
    }
    return defaultBandwidthEstimate;
  }
}
