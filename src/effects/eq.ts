import type { Nux } from "../types";
import { populateKnobs } from "../utils/effectHelper";

const populateEqKnobs = (knobData: Nux.KnobEntry[]) => {
  return populateKnobs(knobData, 32);
};

const SIX_BAND_EQ_VARIANT: Nux.KnobEntry[] = [
  ["100", "100"],
  ["220", "220"],
  ["500", "500"],
  ["1.2k", "1.2k"],
];

const ALIGN_EQ_VARIANT: Nux.KnobEntry[] = [
  ["hpf", "HPF", [0, 2]],
  ["110", "110"],
  ["340", "340"],
  ["600", "600"],
];

const TEN_BAND_EQ_VARIANT: Nux.KnobEntry[] = [
  ["vol", "VOL"],
  ["31.25", "31.25"],
  ["62.5", "62.5"],
  ["125", "125"],
];

const PARA_EQ_VARIANT: Nux.KnobEntry[] = [
  ["freq", "Freq"],
  ["gain", "Gain"],
  ["q", "Q"],
];

const SIX_BAND_EQ = {
  ...populateEqKnobs(SIX_BAND_EQ_VARIANT),
  id: "6_BAND_EQ",
  title: "6-Band EQ",
  onByte: "02",
  offByte: "42",
  dominantColor: "#FFECB3",
};

const ALIGN_EQ = {
  ...populateEqKnobs(ALIGN_EQ_VARIANT),
  id: "ALIGN_EQ",
  title: "Align EQ",
  onByte: "04",
  offByte: "44",
  dominantColor: "#FF8A65",
};

const TEN_BAND_EQ = {
  ...populateEqKnobs(TEN_BAND_EQ_VARIANT),
  id: "10_BAND_EQ",
  title: "10-Band EQ",
  onByte: "06",
  offByte: "46",
  dominantColor: "#BCAAA4",
};

const PARA_EQ = {
  ...populateEqKnobs(PARA_EQ_VARIANT),
  id: "PARA_EQ",
  title: "Para EQ",
  onByte: "08",
  offByte: "48",
  dominantColor: "#B0BEC5",
};

export default {
  eq: {
    byte: 14,
    category: "eq",
    startOffByte: "41",
    startOnByte: "01",
    options: [SIX_BAND_EQ, ALIGN_EQ, TEN_BAND_EQ, PARA_EQ],
  },
};
