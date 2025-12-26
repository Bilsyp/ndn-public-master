// EwmaEstimator.js
export class EwmaEstimator {
  /**
   * @param {number} halfLife
   *  Berapa banyak bobot sample sebelumnya (secara eksponensial)
   *  yang dianggap setara dengan setengah nilai estimasi baru.
   */
  constructor(halfLife) {
    if (halfLife <= 0) {
      throw new Error("halfLife harus lebih besar dari 0");
    }

    this.alpha = Math.exp(Math.log(0.5) / halfLife);

    this.estimate = 0;
    this.totalWeight = 0;
  }

  /**
   * Update alpha dengan halfLife baru.
   *
   * @param {number} halfLife
   */
  updateAlpha(halfLife) {
    if (halfLife <= 0) {
      throw new Error("halfLife harus lebih besar dari 0");
    }
    this.alpha = Math.exp(Math.log(0.5) / halfLife);
  }

  /**
   * Masukkan sample baru.
   *
   * @param {number} weight
   * @param {number} value
   */
  sample(weight, value) {
    const adjAlpha = Math.pow(this.alpha, weight);
    const newEstimate = value * (1 - adjAlpha) + adjAlpha * this.estimate;

    if (!isNaN(newEstimate)) {
      this.estimate = newEstimate;
      this.totalWeight += weight;
    }
  }

  /**
   * Ambil estimasi saat ini.
   *
   * @return {number}
   */
  getEstimate() {
    const zeroFactor = 1 - Math.pow(this.alpha, this.totalWeight);
    return this.estimate / zeroFactor;
  }
}
