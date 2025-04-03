import type { Nux } from "../types";
import { populateKnobs } from "../utils/effectHelper";

const populateEfxKnobs = (knobData: Nux.KnobEntry[]) => {
  return populateKnobs(knobData, 18);
};

const DISTORTION_PLUS_VARIANT: Nux.KnobEntry[] = [
  ["output", "OUTPUT"],
  ["sensitivity", "SENSITIVITY"],
];

const RC_BOOST_VARIANT: Nux.KnobEntry[] = [
  ["gain", "GAIN"],
  ["volume", "VOLUME"],
  ["bass", "BASS"],
  ["treble", "TREBLE"],
];

const AC_BOOST_VARIANT: Nux.KnobEntry[] = [
  ["gain", "GAIN"],
  ["volume", "VOLUME"],
  ["bass", "BASS"],
  ["treble", "TREBLE"],
];

const DIST_ONE_VARIANT: Nux.KnobEntry[] = [
  ["level", "LEVEL"],
  ["tone", "TONE"],
  ["drive", "DRIVE"],
];

const T_SCREAM_VARIANT: Nux.KnobEntry[] = [
  ["drive", "DRIVE"],
  ["tone", "TONE"],
  ["level", "LEVEL"],
];

const BLUES_DRV_VARIANT: Nux.KnobEntry[] = [
  ["level", "LEVEL"],
  ["tone", "TONE"],
  ["gain", "GAIN"],
];

const MORNING_DRV_VARIANT: Nux.KnobEntry[] = [
  ["volume", "VOLUME"],
  ["drive", "DRIVE"],
  ["tone", "TONE"],
];

const EAT_DIST_VARIANT: Nux.KnobEntry[] = [
  ["distortion", "DISTORTION"],
  ["filter", "FILTER"],
  ["volume", "VOLUME"],
];

const RED_DIRT_VARIANT: Nux.KnobEntry[] = [
  ["drive", "DRIVE"],
  ["tone", "TONE"],
  ["level", "LEVEL"],
];

const CRUNCH_VARIANT: Nux.KnobEntry[] = [
  ["volume", "VOLUME"],
  ["tone", "TONE"],
  ["gain", "GAIN"],
];

const MUFF_FUZZ_VARIANT: Nux.KnobEntry[] = [
  ["volume", "VOLUME"],
  ["tone", "TONE"],
  ["sustain", "SUSTAIN"],
];

const KATANA_VARIANT: Nux.KnobEntry[] = [
  ["boost", "", [0, 1]],
  ["volume", "VOLUME"],
];

const ST_SINGER_VARIANT: Nux.KnobEntry[] = [
  ["volume", "VOLUME"],
  ["gain", "GAIN"],
  ["filter", "FILTER"],
];

const RED_FUZZ_VARIANT: Nux.KnobEntry[] = [
  ["gain", "GAIN"],
  ["tone", "TONE"],
  ["output", "OUTPUT"],
];

const TOUCH_WAH_VARIANT: Nux.KnobEntry[] = [
  ["mode", "MODE", [0, 3]],
  ["decay", "DECAY"],
  ["sensitivity", "SENS"],
  ["up-down", "", [0, 1]],
];

// Call populateEfxKnobs to get knob configurations for each effect
const DISTORTION_PLUS = {
  ...populateEfxKnobs(DISTORTION_PLUS_VARIANT),
  id: "DISTORTION_PLUS",
  title: "Distortion +",
  onByte: "02",
  offByte: "42",
  dominantColor: "#FFEB3B",
};

const RC_BOOST = {
  ...populateEfxKnobs(RC_BOOST_VARIANT),
  id: "RC_BOOST",
  title: "RC Boost",
  onByte: "04",
  offByte: "44",
  dominantColor: "#F5F5F5",
};

const AC_BOOST = {
  ...populateEfxKnobs(AC_BOOST_VARIANT),
  id: "AC_BOOST",
  title: "AC Boost",
  onByte: "06",
  offByte: "46",
  dominantColor: "#FFE0B2",
};

const DIST_ONE = {
  ...populateEfxKnobs(DIST_ONE_VARIANT),
  id: "DIST_ONE",
  title: "Dist One",
  onByte: "08",
  offByte: "48",
  dominantColor: "#F4511E",
};

const T_SCREAM = {
  ...populateEfxKnobs(T_SCREAM_VARIANT),
  id: "T_SCREAM",
  title: "T Scream",
  onByte: "0A",
  offByte: "45",
  dominantColor: "#558B2F",
};

const BLUES_DRV = {
  ...populateEfxKnobs(BLUES_DRV_VARIANT),
  id: "BLUES_DRV",
  title: "Blues Drive",
  onByte: "0C",
  offByte: "46",
  dominantColor: "#01579B",
};

const MORNING_DRV = {
  ...populateEfxKnobs(MORNING_DRV_VARIANT),
  id: "MORNING_DRV",
  title: "Morning Drive",
  onByte: "0E",
  offByte: "4E",
  dominantColor: "#9E9D24",
};

const EAT_DIST = {
  ...populateEfxKnobs(EAT_DIST_VARIANT),
  id: "EAT_DIST",
  title: "Eat Dist",
  onByte: "10",
  offByte: "50",
  dominantColor: "#9E9D24",
};

const RED_DIRT = {
  ...populateEfxKnobs(RED_DIRT_VARIANT),
  id: "RED_DIRT",
  title: "Red Dirt",
  onByte: "12",
  offByte: "52",
  dominantColor: "#D32F2F",
};

const CRUNCH = {
  ...populateEfxKnobs(CRUNCH_VARIANT),
  id: "CRUNCH",
  title: "Crunch",
  onByte: "14",
  offByte: "54",
  dominantColor: "#BF360C",
};

const MUFF_FUZZ = {
  ...populateEfxKnobs(MUFF_FUZZ_VARIANT),
  id: "MUFF_FUZZ",
  title: "Muff Fuzz",
  onByte: "16",
  offByte: "56",
  dominantColor: "#E0E0E0",
};

const KATANA = {
  ...populateEfxKnobs(KATANA_VARIANT),
  id: "KATANA",
  title: "Katana",
  onByte: "18",
  offByte: "58",
  dominantColor: "#BDBDBD",
};

const ST_SINGER = {
  ...populateEfxKnobs(ST_SINGER_VARIANT),
  id: "ST_SINGER",
  title: "ST Singer",
  onByte: "1A",
  offByte: "5A",
  dominantColor: "#757575",
};

const RED_FUZZ = {
  ...populateEfxKnobs(RED_FUZZ_VARIANT),
  id: "RED_FUZZ",
  title: "Red Fuzz",
  onByte: "1C",
  offByte: "5C",
  dominantColor: "#BC4646",
};

const TOUCH_WAH = {
  ...populateEfxKnobs(TOUCH_WAH_VARIANT),
  id: "TOUCH_WAH",
  title: "Touch Wah",
  onByte: "1E",
  offByte: "5E",
  dominantColor: "#4A148C",
};

export default {
  efx: {
    category: "efx",
    startOffByte: "41",
    startOnByte: "01",
    options: [
      DISTORTION_PLUS,
      RC_BOOST,
      AC_BOOST,
      DIST_ONE,
      T_SCREAM,
      BLUES_DRV,
      MORNING_DRV,
      EAT_DIST,
      RED_DIRT,
      CRUNCH,
      MUFF_FUZZ,
      KATANA,
      ST_SINGER,
      RED_FUZZ,
      TOUCH_WAH,
    ],
  },
};

//Below are chorus ones that also maybe need to be here but will come from

// { id: "CE_1", title: "CE-1", onByte: "20", offByte: "60" },
// { id: "CE_2", title: "CE-2", onByte: "22", offByte: "62" },
// { id: "ST_CHORUS", title: "ST. Chorus", onByte: "24", offByte: "64" },
// { id: "VIBRATOR", title: "Vibrator", onByte: "26", offByte: "66" },
// { id: "DETUNE", title: "Detune", onByte: "28", offByte: "68" },
// { id: "FLANGER", title: "Flanger", onByte: "2A", offByte: "6A" },
// { id: "PHASE_90", title: "Phase 90", onByte: "2C", offByte: "6C" },
// { id: "PHASE_100", title: "Phase 100", onByte: "2E", offByte: "6E" },
// { id: "SCF", title: "S.C.F", onByte: "30", offByte: "70" },
// { id: "U_VIBE", title: "U-Vibe", onByte: "32", offByte: "72" },
// { id: "TREMOLO", title: "Tremolo", onByte: "34", offByte: "74" },
// { id: "ROTARY", title: "Rotary", onByte: "36", offByte: "76" },
// { id: "HARMONIST", title: "Harmonist", onByte: "38", offByte: "78" },
// { id: "SCH_1", title: "SCH-1", onByte: "3A", offByte: "7A" },
