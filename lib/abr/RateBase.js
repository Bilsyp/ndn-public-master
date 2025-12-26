import { EwmaBandwidthEstimator } from "../Ewma/EwmaBandwidthEstimator";
export class RateBase {
  constructor() {
    this.switch_ = null;
    /** @private {boolean} */
    this.enabled_ = false;
    this.bandwidthEstimator_ = new EwmaBandwidthEstimator();
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.startupComplete_ = false;
    this.config_ = null;
  }
  stop() {
    this.switch_ = null;
    this.enabled_ = false;
    this.variants_ = [];
    this.playbackRate_ = 1;
    this.lastTimeChosenMs_ = null;
  }
  release() {
    this.stop();
  }
  chooseVariant(preferFastSwitching) {
    const bandwidth = this.getBandwidthEstimate();
    const adjustedBandwidth = bandwidth * 0.85;

    let chosen = this.variants_[0];

    for (const variant of this.variants_) {
      if (variant.bandwidth <= adjustedBandwidth) {
        chosen = variant;
      }
    }

    return chosen;
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
    // update bandwidth estimator
    this.bandwidthEstimator_.sample(deltaTimeMs, numBytes);

    if (allowSwitch) {
      this.suggestStreams_(false);
    }
  }
  suggestStreams_(force) {
    if (!this.switch_ || !this.variants_.length) return;
    const bandwidth = this.getBandwidthEstimate();
    const safetyFactor = this.config_.bandwidthDowngradeTarget || 0.85;
    const adjustedBandwidth = bandwidth * safetyFactor;
    let chosen = this.variants_[0];
    for (const variant of this.variants_) {
      if (variant.bandwidth <= adjustedBandwidth) {
        chosen = variant;
      }
    }

    this.switch_(chosen, /* clearBuffer= */ false, /* safeMargin= */ 0);
  }

  trySuggestStreams() {
    if (this.enabled_) {
      this.lastTimeChosenMs_ = Date.now();
      this.suggestStreams_(/* force= */ true);
    }
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
}
