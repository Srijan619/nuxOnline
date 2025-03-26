import type { Nux } from "../../types";
import { EffectCategory } from "../../types/types";

import { unitHexToBytes } from "../../utils/bytesHelper";
import EFFECT_CONFIG from "../../effects";
import { getUpdatedKnobControlsWithValues } from "../../utils/controlMapper";

function extractEffects(response: Uint8Array): Nux.Effect {
  const hexValue = unitHexToBytes(response);

  const getEffectOption = (
    category: Nux.EffectCategory,
    categoryIndex: number, //defines order
    byteValue: string,
    onOffByte?: number,
  ): Nux.EffectOption => {
    const effectCategory = EFFECT_CONFIG[category];

    const effect = effectCategory?.options?.find(
      (data) => data.onByte === byteValue || data.offByte === byteValue,
    );

    if (!effect || !effectCategory.options) {
      return {
        id: undefined,
        title: "Unknown Effect",
        onByte: "",
        offByte: "",
        category: "" as Nux.EffectCategory,
        active: false,
        index: undefined,
        knobs: [],
        options: [],
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
      options: effectCategory?.options,
    };
  };

  //For example in some case: 8th byte is wahstatus, wah object doesn't itself have on/off (or only says wah type)
  // v5 and v4 have different start index for effectsi (v4 has everything to -1 and v5 as it is),
  // this helper could help to quickly adjust the index, but could well and truly be total garbage too
  const getAdjustedIndex = (index: number) => {
    return index - 1;
  };

  // Now, using the adjusted indices
  let effects: Nux.Effect = {
    wah: getEffectOption(
      EffectCategory.Wah,
      0,
      hexValue[getAdjustedIndex(9)],
      response[getAdjustedIndex(8)],
    ),
    comp: getEffectOption(
      EffectCategory.Comp,
      1,
      hexValue[getAdjustedIndex(10)],
    ),
    efx: getEffectOption(
      EffectCategory.Efx,
      2,
      hexValue[getAdjustedIndex(12)],
      response[getAdjustedIndex(11)],
    ),
    amp: getEffectOption(EffectCategory.Amp, 3, hexValue[getAdjustedIndex(13)]),
    eq: getEffectOption(
      EffectCategory.Eq,
      4,
      hexValue[getAdjustedIndex(15)],
      response[getAdjustedIndex(14)],
    ),
    gate: getEffectOption(
      EffectCategory.Gate,
      5,
      hexValue[getAdjustedIndex(16)],
    ),
    mod: getEffectOption(
      EffectCategory.Mod,
      6,
      hexValue[getAdjustedIndex(18)],
      response[getAdjustedIndex(17)],
    ),
    delay: getEffectOption(
      EffectCategory.Delay,
      7,
      hexValue[getAdjustedIndex(19)],
    ),
    reverb: getEffectOption(
      EffectCategory.Reverb,
      8,
      hexValue[getAdjustedIndex(21)],
      response[getAdjustedIndex(20)],
    ),
    ir: getEffectOption(EffectCategory.Ir, 9, hexValue[getAdjustedIndex(22)]),
    sr: getEffectOption(EffectCategory.Sr, 10, hexValue[getAdjustedIndex(23)]),
    vol: getEffectOption(
      EffectCategory.Vol,
      11,
      hexValue[getAdjustedIndex(25)],
    ),
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
