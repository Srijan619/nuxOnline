export default {
  delay: {
    byte: 18,
    category: "🎵 Delay",
    options: [
      {
        id: "DIGITAL_DELAY",
        title: "Digital Delay",
        onByte: "02",
        offByte: "42",
      },
      {
        id: "ANALOG_DELAY",
        title: "Analog Delay",
        onByte: "01",
        offByte: "41",
      },
      {
        id: "MODULATION",
        title: "Modulation",
        onByte: "03",
        offByte: "43",
      },
      {
        id: "TAPE_ECHO",
        title: "Tape Echo",
        onByte: "04",
        offByte: "44",
      },
      {
        id: "REVERSE",
        title: "Reverse",
        onByte: "05",
        offByte: "45",
      },
      {
        id: "PAN_DELAY",
        title: "Pan Delay",
        onByte: "06",
        offByte: "46",
      },
      {
        id: "DUOTIME",
        title: "Duotime",
        onByte: "07",
        offByte: "47",
      },
      {
        id: "PHI_DELAY",
        title: "Phi Delay",
        onByte: "08",
        offByte: "48",
      },
    ],
  },
};
