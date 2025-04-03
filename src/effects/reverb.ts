import type { Nux } from "../types";
import { populateKnobs } from "../utils/effectHelper";

const populateReverbKnobs = (knobData: Nux.KnobEntry[]) => {
  return populateKnobs(knobData, 62);
};

const ROOM_REVERB_VARIANT: Nux.KnobEntry[] = [
  ["decay", "DECAY"],
  ["tone", "TONE"],
  ["level", "LEVEL"],
];

const HALL_REVERB_VARIANT: Nux.KnobEntry[] = [
  ["decay", "DECAY"],
  ["pred", "PRE D."],
  ["liveliness", "LIVELINESS"],
  ["level", "LEVEL"],
];

const DELAY_LEVEL_REVERB_VARIANT: Nux.KnobEntry[] = [
  ["decay", "DECAY"],
  ["level", "LEVEL"],
];

const SHIMMER_REVERB_VARIANT: Nux.KnobEntry[] = [
  ["mix", "MIX"],
  ["decay", "DECAY"],
  ["shim", "SHIM"],
];

const DAMP_REVERB_VARIANT: Nux.KnobEntry[] = [
  ["Mix", "MIX"],
  ["depth", "DEPTH"],
];

const ROOM_REVERB = {
  ...populateReverbKnobs(ROOM_REVERB_VARIANT),
  id: "ROOM_REVERB",
  title: "Room Reverb",
  onByte: "02",
  offByte: "",
  dominantColor: "#757575",
};

const HALL_REVERB = {
  ...populateReverbKnobs(HALL_REVERB_VARIANT),
  id: "HALL_REVERB",
  title: "Hall Reverb",
  onByte: "04",
  offByte: "",
  dominantColor: "#FFF3E0",
};

const PLATE_REVERB = {
  ...populateReverbKnobs(DELAY_LEVEL_REVERB_VARIANT),
  id: "PLATE_REVERB",
  title: "Plate Reverb",
  onByte: "06",
  offByte: "",
  dominantColor: "#D3D3D3",
};

const SPRING_REVERB = {
  ...populateReverbKnobs(DELAY_LEVEL_REVERB_VARIANT),
  id: "SPRING_REVERB",
  title: "Spring Reverb",
  onByte: "08",
  offByte: "",
  dominantColor: "#FFCA28",
};

const SHIMMER_REVERB = {
  ...populateReverbKnobs(SHIMMER_REVERB_VARIANT),
  id: "SHIMMER_REVERB",
  title: "Shimmer Reverb",
  onByte: "0A",
  offByte: "",
  dominantColor: "#BDBDBD",
};

const DAMP_REVERB = {
  ...populateReverbKnobs(DAMP_REVERB_VARIANT),
  id: "DAMP_REVERB",
  title: "Damp Reverb",
  onByte: "0C",
  offByte: "",
  dominantColor: "#B0C4DE",
};

export default {
  reverb: {
    byte: 19,
    category: "reverb",
    startOffByte: "41",
    startOnByte: "01",
    options: [
      ROOM_REVERB,
      HALL_REVERB,
      PLATE_REVERB,
      SPRING_REVERB,
      SHIMMER_REVERB,
      DAMP_REVERB,
    ],
  },
};
