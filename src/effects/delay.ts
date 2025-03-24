import type { KnobEntry } from "../types";
import { populateKnobs } from "../utils/effectHelper";

const populateDelayKnobs = (knobData: KnobEntry[]) => {
  return populateKnobs(knobData, 54);
};

const ANALOG_VARIANT: KnobEntry[] = [
  ["rate", "RATE"],
  ["echo", "ECHO"],
  ["intensity", "INTEN"],
  ["subdivision", "SUB D.", [0, 6]],
];

const DIGITAL_VARIANT: KnobEntry[] = [
  ["effectlevl", "E. LEVEL"],
  ["feedbacklevel", "F. LEVEL"],
  ["delayTime", "D.TIME"],
  ["subdivision", "SUB D.", [0, 6]],
];

const MODULATION_VARIANT: KnobEntry[] = [
  ["time", "TIME"],
  ["level", "LEVEL"],
  ["mod", "MOD"],
  ["repeat", "REPEAT"],
];

const TAPE_ECHO_VARIANT: KnobEntry[] = [
  ["time", "TIME"],
  ["level", "LEVEL"],
  ["mod", "MOD"],
  ["repeat", "REPEAT"],
];

const REVERSE_ECHO_VARIANT: KnobEntry[] = [
  ["time", "TIME"],
  ["mix", "MIX"],
  ["feedbacklevel", "F. LEVEL"],
  ["subdivision", "SUB D.", [0, 6]],
];

const PAN_DELAY_ECHO_VARIANT: KnobEntry[] = [
  ["time", "TIME"],
  ["repeat", "REPEAT"],
  ["delaylevel", "D. LEVEL"],
  ["subdivision", "SUB D.", [0, 6]],
];

const DUO_TIME_VARIANT: KnobEntry[] = [
  ["level", "LEVEL"],
  ["time1", "TIME 1"],
  ["subdivision1", "SUB D.1", [0, 6]],
  ["repeat1", "REP1"],
  ["time2", "TIME 2"],
  ["subdivision2", "SUB D.2", [0, 6]],
  ["repeat2", "REP2"],
  ["para", "PARA"],
];

const PHI_VARIANT: KnobEntry[] = [
  ["mix", "MIX"],
  ["repeat", "REPEAT"],
  ["time", "TIME"],
  ["subdivision", "SUB D.", [0, 6]],
];

export default {
  delay: {
    byte: 18,
    category: "delay",
    options: [
      {
        id: "ANALOG_DELAY",
        title: "Analog Delay",
        onByte: "01",
        offByte: "41",
        ...populateDelayKnobs(ANALOG_VARIANT),
        dominantColor: "#EF5350",
      },
      {
        id: "DIGITAL_DELAY",
        title: "Digital Delay",
        onByte: "02",
        offByte: "42",
        ...populateDelayKnobs(DIGITAL_VARIANT),
        dominantColor: "#01579B",
      },
      {
        id: "MODULATION",
        title: "Modulation",
        onByte: "03",
        offByte: "43",
        ...populateDelayKnobs(MODULATION_VARIANT),
        dominantColor: "#039BE5",
      },
      {
        id: "TAPE_ECHO",
        title: "Tape Echo",
        onByte: "04",
        offByte: "44",
        ...populateDelayKnobs(TAPE_ECHO_VARIANT),
        dominantColor: "#9E9D24",
      },
      {
        id: "REVERSE",
        title: "Reverse",
        onByte: "05",
        offByte: "45",
        ...populateDelayKnobs(REVERSE_ECHO_VARIANT),
        dominantColor: "#9E9D24",
      },
      {
        id: "PAN_DELAY",
        title: "Pan Delay",
        onByte: "06",
        offByte: "46",
        ...populateDelayKnobs(PAN_DELAY_ECHO_VARIANT),
        dominantColor: "#0D47A1",
      },
      {
        id: "DUOTIME",
        title: "Duotime",
        onByte: "07",
        offByte: "47",
        ...populateDelayKnobs(DUO_TIME_VARIANT),
        dominantColor: "#0D47A1",
      },
      {
        id: "PHI_DELAY",
        title: "Phi Delay",
        onByte: "08",
        offByte: "48",
        ...populateDelayKnobs(PHI_VARIANT),
        dominantColor: "#000000",
      },
    ],
  },
};
