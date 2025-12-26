export const graph = {
  nodes: [
    // Core / Backbone
    {
      id: "core-1",
      label: "Core Node A",
      group: "core",
      title: "NDN Core Router A",
    },
    {
      id: "core-2",
      label: "Core Node B",
      group: "core",
      title: "NDN Core Router B",
    },
    {
      id: "core-3",
      label: "Core Node C",
      group: "core",
      title: "NDN Core Router C",
    },

    // Producer
    {
      id: "producer",
      label: "Video Producer",
      group: "producer",
      title: "Origin Video Source (DASH / NDN)",
    },

    // Clients
    {
      id: "client-1",
      label: "Client 1",
      group: "client",
      title: "Video Consumer",
    },
    {
      id: "client-2",
      label: "Client 2",
      group: "client",
      title: "Video Consumer",
    },
    {
      id: "client-3",
      label: "Client 3",
      group: "client",
      title: "Video Consumer",
    },
  ],

  edges: [
    // Core backbone (triangle)
    { from: "core-1", to: "core-2" },
    { from: "core-2", to: "core-3" },
    { from: "core-3", to: "core-1" },

    // Producer connection
    { from: "producer", to: "core-3", label: "video source" },

    // Clients
    { from: "client-1", to: "core-1", label: "request /video.mpd" },
    { from: "client-2", to: "core-2", label: "request /video.mpd" },
    { from: "client-3", to: "core-2", label: "request /video.mpd" },
  ],
};

export const options = {
  layout: {
    improvedLayout: true,
  },
  physics: {
    stabilization: true,
    barnesHut: {
      gravitationalConstant: -30000,
      springLength: 150,
      springConstant: 0.04,
    },
  },
  nodes: {
    shape: "dot",
    size: 18,
    font: {
      color: "#1e293b",
      size: 12,
      face: "Inter",
    },
  },
  groups: {
    core: {
      color: {
        background: "#3b82f6",
        border: "#1d4ed8",
      },
      size: 22,
    },
    client: {
      color: {
        background: "#10b981",
        border: "#047857",
      },
      size: 16,
    },
    producer: {
      color: {
        background: "#8b5cf6",
        border: "#6d28d9",
      },
      size: 24,
    },
  },
  edges: {
    color: "#94a3b8",
    arrows: {
      to: { enabled: false },
    },
    font: {
      size: 10,
      align: "middle",
    },
    smooth: true,
  },
  interaction: {
    hover: true,
    tooltipDelay: 150,
  },
};
