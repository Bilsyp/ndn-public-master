export const ABR_ALGORITHMS = {
  NEURAL_NETWORK: {
    key: "neural_network",
    label: "Neural Network (FNN)",
    description: "Adaptive bitrate using Feedforward Neural Network",
    category: "ml",
  },

  BUFFER_BASED: {
    key: "buffer_based",
    label: "Buffer Based (BB)",
    description: "Buffer occupancy driven bitrate selection",
    category: "heuristic",
  },

  THROUGHPUT_BASED: {
    key: "throughput_based",
    label: "Throughput Based (Simple ABR)",
    description: "ABR based on recent network throughput estimation",
    category: "heuristic",
  },

  RATE_BASED: {
    key: "rate_based",
    label: "Rate Based",
    description: "Fixed rate ladder selection with safety margin",
    category: "rule_based",
  },

  HYBRID: {
    key: "hybrid",
    label: "Hybrid ABR",
    description: "Combination of buffer, throughput, and ML signals",
    category: "hybrid",
  },
};
