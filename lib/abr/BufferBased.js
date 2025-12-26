import { EwmaBandwidthEstimator } from "../Ewma/EwmaBandwidthEstimator";
export class BufferBased {
  constructor(player) {
    this.player = player;
    this.switch_ = null;
    this.bandwidthEstimator_ = new EwmaBandwidthEstimator();
    this.enabled_ = false;
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.startupComplete_ = false;
    this.config_ = null;
    this.lastBufferLevel_ = 0;
    this.lowBuffer_ = 0.2;
    this.highBuffer_ = 0.8;
  }
  stop() {
    this.switch_ = null;
    this.enabled_ = false;
    this.lastBufferLevel_ = 0;
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.lastTimeChosenMs_ = null;
  }
  release() {
    this.stop();
  }
  chooseVariant() {
    const index = this.mapBufferToVariant_(this.lastBufferLevel_);
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
  mapBufferToVariant_(buffer) {
    const n = this.variants_.length;

    if (buffer <= this.lowBuffer_) return 0;
    if (buffer >= this.highBuffer_) return n - 1;

    const ratio =
      (buffer - this.lowBuffer_) / (this.highBuffer_ - this.lowBuffer_);

    return Math.floor(ratio * n);
  }
  segmentDownloaded(deltaTimeMs, numBytes, allowSwitch, request, context) {
    this.lastBufferLevel_ = this.getBufferLevel();
    if (allowSwitch) {
      this.suggestStreams_();
    }
  }

  suggestStreams_() {
    const variant = this.chooseVariant();
    this.switch_(variant, false, 0);
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
