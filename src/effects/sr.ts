export default {
  sr: {
    byte: 23,
    category: "sr",
    startOffByte: "41",
    startOnByte: "01",
    options: [
      {
        id: "S_R",
        title: "S/R",
        onByte: "00",
        offByte: "01",
        knobs: [
          {
            id: "send",
            title: "SEND",
            range: [0, 100],
            ctrl: 72,
          },
          {
            id: "return",
            title: "RETURN",
            range: [0, 100],
            ctrl: 73,
          },
        ],
        dominantColor: "#DCEDC8",
      },
    ],
  },
};
