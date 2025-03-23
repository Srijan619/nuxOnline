export default {
  gate: {
    knobControlStart: [44, 45],
    category: "🚪 Gate",
    options: [
      {
        id: "DEFAULT_GATE",
        title: "Default Gate",
        onByte: "01",
        offByte: "41",
        knobs: [
          {
            id: "sens",
            title: "SENS",
            range: [0, 100],
            ctrl: 44,
          },
          {
            id: "decay",
            title: "DECAY",
            range: [0, 100],
            ctrl: 45,
          },
        ],
        dominantColor: "#9CCC65",
      },
    ],
  },
};
