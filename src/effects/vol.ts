export default {
  vol: {
    byte: 25,
    category: "vol",
    options: [
      {
        id: "VOL",
        title: "Volume",
        onByte: "01",
        offByte: "41",
        knobs: [
          {
            id: "min",
            title: "MIN",
            range: [0, 100],
            ctrl: 74,
          },
          {
            id: "max",
            title: "MAX",
            range: [0, 100],
            ctrl: 75,
          },
        ],
        dominantColor: "#FFEE58",
      },
    ],
  },
};
