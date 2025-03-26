import type { Nux } from "../types";
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
  { startByte: 40 },
  { startByte: 41, endByte: 42, isDoubleByte: true },
  { startByte: 43 },
  { startByte: 44, endByte: 45, isDoubleByte: true },
  { startByte: 46 },
];

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
    default:
      break;
  }
  if (!controlRanges) return [];

  const controlValues = translateControlValues(input, controlRanges);
  const knobs = getEffectKnobs(effectOption);
  knobs?.forEach((knob: Nux.Knob, index: number) => {
    knob.currentValue = controlValues[index] || 0;
  });
  return knobs;
};

export { getUpdatedKnobControlsWithValues };
