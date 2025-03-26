import type { Effect, EffectOption } from "../types";
import { unitHexToBytes } from "./bytesHelper";
import effectsMapping from "../effects";
import { getUpdatedKnobControlsWithValues } from "./controlMapper";

function extractEffects(response: Uint8Array): Effect {
  const hexValue = unitHexToBytes(response);

  console.log("Effects hex", hexValue);
  const getEffectOption = (
    category: keyof typeof effectsMapping.effects,
    categoryIndex: number, //defines order
    byteValue: string,
    onOffByte?: number,
  ): EffectOption => {
    const effectCategory = effectsMapping.effects[category];

    const effect = effectCategory?.options?.find(
      (data) => data.onByte === byteValue || data.offByte === byteValue,
    );

    if (!effect) {
      return {
        id: undefined,
        title: "Unknown Effect",
        onByte: "",
        offByte: "",
        category: "Unknown category",
        active: false,
        index: undefined,
        knobs: [],
      };
    }

    // onOffByte overrides onByte/offByte of object
    const effectActiveStatus = onOffByte
      ? onOffByte == 0
      : effect.onByte === byteValue;

    return {
      id: effect.id,
      title: effect.title,
      onByte: effect.onByte,
      offByte: effect.offByte,
      category: category,
      active: effectActiveStatus,
      index: categoryIndex,
      knobs: [],
    };
  };

  //For example in some case: 8th byte is wahstatus, wah object doesn't itself have on/off (or only says wah type)
  // v5 and v4 have different start index for effects, this helper could help to quickly adjust the index, but could well and truly be total garbage too
  const getAdjustedIndex = (index: number) => {
    return index;
  };

  // Now, using the adjusted indices
  let effects: Effect = {
    wah: getEffectOption(
      "wah",
      0,
      hexValue[getAdjustedIndex(9)],
      response[getAdjustedIndex(8)],
    ),
    comp: getEffectOption("comp", 1, hexValue[getAdjustedIndex(10)]),
    efx: getEffectOption(
      "efx",
      2,
      hexValue[getAdjustedIndex(12)],
      response[getAdjustedIndex(11)],
    ),
    amp: getEffectOption("amp", 3, hexValue[getAdjustedIndex(13)]),
    eq: getEffectOption(
      "eq",
      4,
      hexValue[getAdjustedIndex(15)],
      response[getAdjustedIndex(14)],
    ),
    gate: getEffectOption("gate", 5, hexValue[getAdjustedIndex(16)]),
    mod: getEffectOption(
      "mod",
      6,
      hexValue[getAdjustedIndex(18)],
      response[getAdjustedIndex(17)],
    ),
    delay: getEffectOption("delay", 7, hexValue[getAdjustedIndex(19)]),
    reverb: getEffectOption(
      "reverb",
      8,
      hexValue[getAdjustedIndex(21)],
      response[getAdjustedIndex(20)],
    ),
    ir: getEffectOption("ir", 9, hexValue[getAdjustedIndex(22)]),
    sr: getEffectOption("sr", 10, hexValue[getAdjustedIndex(23)]),
    vol: getEffectOption("vol", 11, hexValue[getAdjustedIndex(25)]),
  };

  effects = {
    ...effects,
    amp: {
      ...effects.amp,
      knobs: [...getUpdatedKnobControlsWithValues(effects.amp, response)],
    },
    efx: {
      ...effects.efx,
      knobs: [...getUpdatedKnobControlsWithValues(effects.efx, response)],
    },
  };
  return effects;
}

export { extractEffects };
