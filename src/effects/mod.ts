import type { Nux } from "../types";
import { populateKnobs } from "../utils/effectHelper";

// Local helper function that defaults to 18 for startCtrl
const populateModKnobs = (
  knobData: Nux.KnobEntry[] = PRIMARY_CHORUS_VARIANT,
) => {
  return populateKnobs(knobData, 48);
};

// Define a primary variant for pedals with common knobs
const PRIMARY_CHORUS_VARIANT: Nux.KnobEntry[] = [
  ["rate", "RATE"],
  ["depth", "DEPTH"],
];

const S_C_F_VARIANT: Nux.KnobEntry[] = [
  ["speed", "SPEED"],
  ["width", "WIDTH"],
  ["chfl", "CH/FL", [0, 2]],
  ["intensity", "INTENSITY"],
];

const U_VIBE_VARIANT: Nux.KnobEntry[] = [
  ["speed", "SPEED"],
  ["volume", "VOLUME"],
  ["intensity", "INTENSITY"],
  ["chvib", "CH/VIB", [0, 1]],
];

const ROTARY_VARIANT: Nux.KnobEntry[] = [
  ["balance", "BALANCE"],
  ["speed", "SPEED"],
  ["subdelay", "SUB D.", [0, 6]],
];

const RATE_DEPTH_SUB_DELAY_VARIANT: Nux.KnobEntry[] = [
  ...PRIMARY_CHORUS_VARIANT,
  ["subdelay", "SUB D.", [0, 6]],
];

const ST_CHORUS_VARIANT: Nux.KnobEntry[] = [
  ["intensity", "INTEN."],
  ["width", "WIDTH"],
  ["rate", "RATE"],
  ["subdelay", "SUB D.", [0, 6]],
];

const DETUNE_VARIANT: Nux.KnobEntry[] = [
  ["shiftl", "SHIFT-L"],
  ["mix", "MIX"],
  ["shiftr", "SHIFT-R"],
];

const FLANGER_VARIANT: Nux.KnobEntry[] = [
  ["level", "LEVEL"],
  ["rate", "RATE"],
  ["width", "WIDTH"],
  ["feedback", "FEEDBACK"],
];

const SPEED_SUB_DELAY_VARIANT: Nux.KnobEntry[] = [
  ["speed", "SPEED"],
  ["subdelay", "SUB D.", [0, 6]],
];

const PHASE_100_VARIANT: Nux.KnobEntry[] = [
  ["intensity", "INTENSITY"],
  ...SPEED_SUB_DELAY_VARIANT,
];

const HARMONIST_VARIANT: Nux.KnobEntry[] = [
  ["key", "KEY", [0, 11]], //TODO: this should be displayed with different component...
  ["minor-major", "MIN/MAJ", [0, 1]],
  ["harmony", "HARMO", [0, 9]], //TODO: same here..
  ["blend", "BLEND"],
];

const SCH_1_VARIANT: Nux.KnobEntry[] = [
  ...PRIMARY_CHORUS_VARIANT,
  ["tone", "TONE"],
  ["subdelay", "SUB D.", [0, 6]],
];

const CE_1_VARIANT: Nux.KnobEntry[] = [
  ["intensity", "INTENSITY"],
  ["depth", "DEPTH"],
  ["rate", "RATE"],
  ["subdelay", "SUB D.", [0, 6]],
];

const CE_1 = {
  ...populateModKnobs(CE_1_VARIANT),
  id: "CE_1",
  title: "CE-1",
  onByte: "02",
  offByte: "",
  dominantColor: "#B0BEC5",
};

const CE_2 = {
  ...populateModKnobs(RATE_DEPTH_SUB_DELAY_VARIANT),
  id: "CE_2",
  title: "CE-2",
  onByte: "04",
  offByte: "",
  dominantColor: "#4DB6AC",
};

const ST_CHORUS = {
  ...populateModKnobs(ST_CHORUS_VARIANT),
  id: "ST_CHORUS",
  title: "Stereo Chorus",
  onByte: "06",
  offByte: "",
  dominantColor: "#FFEB3B",
};

const VIBRATOR = {
  ...populateModKnobs(RATE_DEPTH_SUB_DELAY_VARIANT),
  id: "VIBRATOR",
  title: "Vibrator",
  onByte: "08",
  offByte: "",
  dominantColor: "#2196F3",
};

const DETUNE = {
  ...populateModKnobs(DETUNE_VARIANT),
  id: "DETUNE",
  title: "Detune",
  onByte: "0A",
  offByte: "",
  dominantColor: "#A5D6A7",
};

const FLANGER = {
  ...populateModKnobs(FLANGER_VARIANT),
  id: "FLANGER",
  title: "Flanger",
  onByte: "0C",
  offByte: "",
  dominantColor: "#9C27B0",
};

const PHASE_90 = {
  ...populateModKnobs(SPEED_SUB_DELAY_VARIANT),
  id: "PHASE_90",
  title: "Phase 90",
  onByte: "0E",
  offByte: "",
  dominantColor: "#F57F17",
};

const PHASE_100 = {
  ...populateModKnobs(PHASE_100_VARIANT),
  id: "PHASE_100",
  title: "Phase 100",
  onByte: "10",
  offByte: "",
  dominantColor: "#F57F17",
};

const S_C_F = {
  ...populateModKnobs(S_C_F_VARIANT),
  id: "S_C_F",
  title: "S.C.F",
  onByte: "12",
  offByte: "",
  dominantColor: "#37474F",
};

const U_VIBE = {
  ...populateModKnobs(U_VIBE_VARIANT),
  id: "U_VIBE",
  title: "U-Vibe",
  onByte: "14",
  offByte: "",
  dominantColor: "#EFEBE9",
};

const TREMOLO = {
  ...populateModKnobs(RATE_DEPTH_SUB_DELAY_VARIANT),
  id: "TREMOLO",
  title: "Tremolo",
  onByte: "16",
  offByte: "",
  dominantColor: "#546E7A",
};

const ROTARY = {
  ...populateModKnobs(ROTARY_VARIANT),
  id: "ROTARY",
  title: "Rotary",
  onByte: "18",
  offByte: "",
  dominantColor: "#795548",
};

const HARMONIST = {
  ...populateModKnobs(HARMONIST_VARIANT),
  id: "HARMONIST",
  title: "Harmonist",
  onByte: "1A",
  offByte: "",
  dominantColor: "#EF5350",
};

const SCH_1 = {
  ...populateModKnobs(SCH_1_VARIANT),
  id: "SCH_1",
  title: "SCH-1",
  onByte: "1C",
  offByte: "",
  dominantColor: "#455A64",
};

export default {
  mod: {
    byte: 18,
    category: "mod",
    startOffByte: "41",
    startOnByte: "01",
    options: [
      CE_1,
      CE_2,
      ST_CHORUS,
      VIBRATOR,
      DETUNE,
      FLANGER,
      PHASE_90,
      PHASE_100,
      S_C_F,
      U_VIBE,
      TREMOLO,
      ROTARY,
      HARMONIST,
      SCH_1,

      // ALL DIST VARIANTS BELOW
      // {
      //   id: "DISTORTION_PLUS",
      //   title: "Distortion +",
      //   onByte: "1E",
      //   offByte: "",
      // },
      // { id: "RC_BOOST", title: "RC Boost", onByte: "20", offByte: "" },
      // { id: "AC_BOOST", title: "AC Boost", onByte: "22", offByte: "" },
      // { id: "DIST_ONE", title: "Dist One", onByte: "24", offByte: "" },
      // { id: "T_SCREAM", title: "T Scream", onByte: "26", offByte: "" },
      // { id: "BLUES_DRV", title: "Blues Driver", onByte: "28", offByte: "" },
      // {
      //   id: "MORNING_DRV",
      //   title: "Morning Drive",
      //   onByte: "2A",
      //   offByte: "",
      // },
      // { id: "EAT_DIST", title: "Eat Dist", onByte: "2C", offByte: "" },
      // { id: "RED_DIRT", title: "Red Dirt", onByte: "2E", offByte: "" },
      // { id: "CRUNCH", title: "Crunch", onByte: "30", offByte: "" },
      // { id: "MUFF_FUZZ", title: "Muff Fuzz", onByte: "32", offByte: "" },
      // { id: "KATANA", title: "Katana", onByte: "34", offByte: "" },
      // { id: "ST_SINGER", title: "ST Singer", onByte: "36", offByte: "" },
      // { id: "RED_FUZZ", title: "Red Fuzz", onByte: "38", offByte: "" },
      // { id: "TOUCH_WAH", title: "Touch Wah", onByte: "3A", offByte: "" },
    ],
  },
};
