export default {
  wah: {
    category: "🎚️ Wah",
    options: [
      { id: "CLYDE", title: "Clyde Wah", onByte: "02", offByte: "41" },
      { id: "CRY_BB", title: "Cry Baby", onByte: "04", offByte: "42" },
      { id: "V847", title: "V847", onByte: "06", offByte: "43" },
      {
        id: "HORSE_WAH",
        title: "Horse Wah",
        onByte: "08",
        offByte: "44",
        knobs: [
          {
            id: "contour",
            title: "CONTOUR",
            range: [0, 100],
            ctrl: 12,
          },
          {
            id: "range",
            title: "Range",
            range: [0, 5],
            ctrl: 13,
          },
        ],
      },
      {
        id: "OCTAVE_SHIFT",
        title: "Octave Shift",
        onByte: "0A",
        offByte: "45",
        knobs: [
          {
            id: "up-down",
            title: "",
            range: [0, 1],
            ctrl: 12,
          },
        ],
      },
    ],
  },
};
