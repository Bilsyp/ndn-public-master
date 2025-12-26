import { EwmaEstimator } from "./EwmaEstimators";
export class EwmaBandwidthEstimator {
  constructor() {
    // EWMA cepat → responsif terhadap perubahan bandwidth
    this.fast = new EwmaEstimator(2); // half-life 2 detik

    // EWMA lambat → stabil & smooth
    this.slow = new EwmaEstimator(5); // half-life 5 detik

    // Total bytes untuk menentukan kapan estimasi dianggap valid
    this.bytesSampled = 0;

    // Batas minimum buat percaya estimasi (default 128 KB)
    this.minTotalBytes = 128 * 1024;

    // Sampel kecil (< 16 KB) diabaikan karena bias latensi awal
    this.minBytes = 16 * 1024;
  }

  /**
   * Update konfigurasi (jika lo mau dynamic tuning)
   */
  configure(config) {
    this.minTotalBytes = config.minTotalBytes ?? this.minTotalBytes;
    this.minBytes = config.minBytes ?? this.minBytes;

    this.fast.updateAlpha(config.fastHalfLife);
    this.slow.updateAlpha(config.slowHalfLife);
  }

  /**
   * Input sampel bandwidth baru
   *
   * @param {number} durationMs  waktu download dalam ms
   * @param {number} numBytes    ukuran data download
   */
  sample(durationMs, numBytes) {
    // Abaikan sampel terlalu kecil (bias startup)
    if (numBytes < this.minBytes) return;

    // Bandwidth dalam bps
    const bandwidth = (8000 * numBytes) / durationMs;

    // Bobot = durasi dalam detik
    const weight = durationMs / 1000;

    this.bytesSampled += numBytes;

    this.fast.sample(weight, bandwidth);
    this.slow.sample(weight, bandwidth);
  }

  /**
   * Dapatkan estimasi bandwidth final
   */
  getBandwidthEstimate(defaultEstimate) {
    if (this.bytesSampled < this.minTotalBytes) {
      return defaultEstimate;
    }

    // Minimum dari 2 EWMA → adapt down cepat, adapt up lambat
    return Math.min(this.fast.getEstimate(), this.slow.getEstimate());
  }

  hasGoodEstimate() {
    return this.bytesSampled >= this.minTotalBytes;
  }
}
