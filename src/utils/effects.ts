export default {
  effects: {
    wah: {
      byte: 9,
      category: "🎚️ Wah",
      options: [
        { id: "CLYDE", title: "Clyde Wah", onByte: "02", offByte: "" },
        { id: "CRY_BB", title: "Cry Baby", onByte: "04", offByte: "" },
        { id: "V847", title: "V847", onByte: "06", offByte: "" },
        { id: "HORSE_WAH", title: "Horse Wah", onByte: "08", offByte: "" },
        {
          id: "OCTAVE_SHIFT",
          title: "Octave Shift",
          onByte: "0A",
          offByte: "",
        },
      ],
    },
    cmp: {
      byte: 10,
      category: "🎛️ Compressor / Modulation",
      options: [
        { id: "ROSE_COMP", title: "Rose Comp", onByte: "01", offByte: "41" },
        { id: "K_COMP", title: "K Comp", onByte: "02", offByte: "42" },
        {
          id: "STUDIO_COMP",
          title: "Studio Comp",
          onByte: "03",
          offByte: "43",
        },
        {
          id: "DISTORTION_PLUS",
          title: "Distortion +",
          onByte: "04",
          offByte: "44",
        },
      ],
    },
    amp: {
      byte: 13,
      category: "🎚️ Amp / EQ / Gate",
      options: [
        { id: "JAZZ_CLEAN", title: "Jazz Clean", onByte: "01", offByte: "41" },
        {
          id: "DELUXE_RVB",
          title: "Deluxe Reverb",
          onByte: "02",
          offByte: "42",
        },
        { id: "BASSMATE", title: "Bassmate", onByte: "03", offByte: "43" },
      ],
    },
    delay: {
      byte: 18,
      category: "🎵 Delay & Reverb",
      options: [
        {
          id: "DIGITAL_DELAY",
          title: "Digital Delay",
          onByte: "01",
          offByte: "41",
        },
      ],
    },
    reverb: {
      byte: 19,
      category: "🎵 Delay & Reverb",
      options: [
        {
          id: "HALL_REVERB",
          title: "Hall Reverb",
          onByte: "01",
          offByte: "41",
        },
      ],
    },
    ir: {
      byte: 21,
      category: "🎛️ IR / SR / Volume",
      options: [
        { id: "CUSTOM_IR", title: "Custom IR", onByte: "01", offByte: "41" },
      ],
    },
  },
};
