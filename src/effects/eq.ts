export default {
  eq: {
    byte: 14,
    category: "🎛️ EQ",
    options: [
      { id: "6_BAND_EQ", title: "6-Band EQ", onByte: "02", offByte: "42" },
      { id: "ALIGN_EQ", title: "Align EQ", onByte: "04", offByte: "44" },
      { id: "10_BAND_EQ", title: "10-Band EQ", onByte: "06", offByte: "46" },
      { id: "PARA_EQ", title: "Para EQ", onByte: "08", offByte: "48" },
    ],
  },
};
