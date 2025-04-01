import type { Nux } from "../types";
import { EffectCategory } from "../types/types";
import { getEffectKnobs } from "./effectHelper";

// Type for control ranges
type ControlRange = {
  startByte: number; // Start byte for the range
  endByte?: number; // End byte for the range (optional, for single-byte, endByte is not required)
  isDoubleByte?: boolean; // Flag to indicate if this range is double-byte (default: false)
};

// Function to translate byte array to control values
function translateControlValues(
  input: Uint8Array,
  controlRanges: ControlRange[],
): number[] {
  const controlValues: number[] = [];
  let inputIndex = -1;

  for (const range of controlRanges) {
    while (inputIndex < range.startByte) {
      inputIndex++;
    }

    if (range.endByte) {
      // Double-byte range (startByte to endByte)
      const msb = input[inputIndex]; // Most Significant Byte
      const lsb = input[inputIndex + 1]; // Least Significant Byte
      let controlValue = msb * 128 + lsb;

      // If it's a double-byte range, divide by 2 to normalize the value
      if (range.isDoubleByte) {
        controlValue /= 2;
      }

      controlValues.push(controlValue);
      inputIndex += 2; // Move to the next pair of bytes
    } else {
      // Single-byte range (only one byte)
      controlValues.push(input[inputIndex]);
      inputIndex++;
    }
  }

  return controlValues;
}

const ampControlRanges: ControlRange[] = [
  { startByte: 49, endByte: 50, isDoubleByte: true },
  { startByte: 51 },
  { startByte: 52, endByte: 53, isDoubleByte: true },
  { startByte: 54 },
  { startByte: 55, endByte: 56, isDoubleByte: true },
  { startByte: 57 },
  { startByte: 58, endByte: 59, isDoubleByte: true },
  { startByte: 60 },
];

const efxControlRanges: ControlRange[] = [
  { startByte: 39 },
  { startByte: 40, endByte: 41, isDoubleByte: true },
  { startByte: 42 },
  { startByte: 43, endByte: 44, isDoubleByte: true },
  { startByte: 45 },
];

const gateControlRanges: ControlRange[] = [
  { startByte: 82, endByte: 83, isDoubleByte: true },
  { startByte: 84 },
];

const srControlRanges: ControlRange[] = [
  { startByte: 132 },
  { startByte: 133, endByte: 134, isDoubleByte: true },
];

const compControlRanges: ControlRange[] = [
  { startByte: 31, endByte: 32, isDoubleByte: true },
  { startByte: 33 },
  { startByte: 34, endByte: 35, isDoubleByte: true },
  { startByte: 36 },
];

const modControlRanges: ControlRange[] = [
  { startByte: 90 },
  { startByte: 91, endByte: 92, isDoubleByte: true },
  { startByte: 92 },
  { startByte: 94, endByte: 95, isDoubleByte: true },
  { startByte: 96 },
];

const reverbControlRanges: ControlRange[] = [
  { startByte: 114 },
  { startByte: 115, endByte: 116, isDoubleByte: true },
  { startByte: 117 },
  { startByte: 118, endByte: 119, isDoubleByte: true },
];

//TODO:This needs cheecking still
const irControlRanges: ControlRange[] = [
  { startByte: 122 },
  { startByte: 123, endByte: 124, isDoubleByte: true },
  { startByte: 125 },
  { startByte: 126, endByte: 127, isDoubleByte: true },
];
const delayControlRanges: ControlRange[] = [
  { startByte: 100, endByte: 101, isDoubleByte: true },
  { startByte: 102 },
  { startByte: 103, endByte: 104, isDoubleByte: true },
  { startByte: 105 },
  { startByte: 106, endByte: 107, isDoubleByte: true },
  { startByte: 108 },
  { startByte: 109, endByte: 110, isDoubleByte: true },
  { startByte: 111 },
];

const eqControlRanges: ControlRange[] = [
  { startByte: 63 },
  { startByte: 64, endByte: 65, isDoubleByte: true },
  { startByte: 66 },
  { startByte: 67, endByte: 68, isDoubleByte: true },
  { startByte: 69 },
  { startByte: 70, endByte: 71, isDoubleByte: true },
  { startByte: 72 },
  { startByte: 73, endByte: 74, isDoubleByte: true },
  { startByte: 75 },
  { startByte: 76, endByte: 77, isDoubleByte: true },
  { startByte: 78 },
  { startByte: 79, endByte: 80, isDoubleByte: true },
];

const wahControlRanges: ControlRange[] = [{ startByte: 27 }, { startByte: 29 }];

const getUpdatedKnobControlsWithValues = (
  effectOption: Nux.EffectOption,
  input: Uint8Array,
) => {
  let controlRanges;
  switch (effectOption.category) {
    case "amp":
      controlRanges = ampControlRanges;
      break;
    case "efx":
      controlRanges = efxControlRanges;
      break;
    case "gate":
      controlRanges = gateControlRanges;
      break;
    case "wah":
      controlRanges = wahControlRanges;
      break;
    case "comp":
      controlRanges = compControlRanges;
      break;
    case "mod":
      controlRanges = modControlRanges;
      break;
    case "sr":
      controlRanges = srControlRanges;
      break;
    case "reverb":
      controlRanges = reverbControlRanges;
      break;
    case "delay":
      controlRanges = delayControlRanges;
      break;
    case "eq":
      controlRanges = eqControlRanges;
      break;
    case "ir":
      controlRanges = irControlRanges;
      break;
    default:
      break;
  }
  if (!controlRanges) return [];

  const controlValues = translateControlValues(input, controlRanges);
  const knobs = getEffectKnobs(effectOption);
  knobs?.forEach((knob: Nux.Knob, index: number) => {
    knob.currentValue = Math.max(
      knob.range[0],
      Math.min(controlValues[index] || 0, knob.range[1]),
    );
  });
  return knobs;
};

export { getUpdatedKnobControlsWithValues };
