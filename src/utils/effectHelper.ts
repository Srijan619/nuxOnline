import EFFECT_CONFIG from "../effects";
import { EffectConfig, Nux } from "../types";

const getMainEffectGroup = (effectOption: Nux.EffectOption) => {
  const effectCategory = EFFECT_CONFIG[effectOption?.category];
  const matchedEffect = effectCategory?.options?.find(
    (opt) => opt.id === effectOption?.id,
  );
  return matchedEffect;
};

const getMatchingEffectColor = (effectOption: Nux.EffectOption) => {
  return (
    getMainEffectGroup(effectOption)?.dominantColor ||
    `var(--${effectOption?.category}-color)`
  );
};

const getEffectKnobs = (effectOption: Nux.EffectOption) => {
  return getMainEffectGroup(effectOption)?.knobs || [];
};

const populateKnobs = (
  knobData: Nux.KnobEntry[],
  startCtrl: number,
): Nux.KnobsConfig => {
  return {
    knobs: knobData?.map(([id, title, range], index) => ({
      id,
      title,
      range: range || [0, 100],
      ctrl: startCtrl + index,
    })),
  };
};

const getEffectStartOnOffByte = (
  category: Nux.EffectCategory,
  id: string,
): { startOnByte: string; startOffByte: string } => {
  if (!category || !id) return { startOnByte: "", startOffByte: "" };

  const effectCategory = EFFECT_CONFIG[category];
  const effectIndex = effectCategory?.options?.findIndex(
    (opt: any) => opt.id === id,
  );

  if (!effectIndex) return { startOnByte: "", startOffByte: "" };

  const matchedEffect = effectCategory?.options?.find(
    (opt: any) => opt.id === id,
  );

  if (!effectCategory?.startOnByte || !effectCategory?.startOffByte)
    return {
      startOnByte: matchedEffect?.onByte || "",
      startOffByte: matchedEffect?.offByte || "",
    };

  const startOnByte = calculateByte(effectCategory?.startOnByte, effectIndex);
  const startOffByte = calculateByte(effectCategory?.startOffByte, effectIndex);

  return {
    startOnByte,
    startOffByte,
  };
};

const getAndUpdateEffectByControlKnob = (
  effects: Nux.Effect | undefined,
  ctrl: number,
  value: number,
) => {
  if (!effects) return;
  for (const [_, effectValue] of Object.entries(effects)) {
    const matchedKnob = effectValue?.knobs?.find((knob: Nux.Knob) => {
      return knob.ctrl === ctrl;
    });

    // Do nothing if no range is provided as it might be risky
    if (matchedKnob && matchedKnob.range) {
      const [minValue, maxValue] = matchedKnob.range;
      // Cap the value within the defined range
      if (value < minValue) {
        matchedKnob.currentValue = minValue;
      } else if (value > maxValue) {
        matchedKnob.currentValue = maxValue;
      } else {
        matchedKnob.currentValue = value;
      }
    }
  }
  return effects;
};

const determineActiveEffectBasedOnCurrentKnob = (
  ctrl: number,
): Nux.EffectOption | undefined => {
  for (const effectValue of Object.values<
    EffectConfig.EffectType[Nux.EffectCategory]
  >(EFFECT_CONFIG)) {
    if (!effectValue || !effectValue.options) continue;

    const matchedOption = effectValue.options.find(
      (opt): opt is Nux.EffectOption =>
        opt.knobs?.some((knob: Nux.Knob) => knob.ctrl === ctrl) ?? false,
    );

    if (matchedOption) {
      return matchedOption;
    }
  }
  return undefined;
};

const calculateByte = (byte: string, index: number) => {
  const byteValue = parseInt(byte, 16);
  const adjustedByte = byteValue + index;

  return adjustedByte.toString(16).padStart(2, "0").toUpperCase();
};

export {
  getMatchingEffectColor,
  getEffectKnobs,
  populateKnobs,
  getEffectStartOnOffByte,
  getAndUpdateEffectByControlKnob,
  determineActiveEffectBasedOnCurrentKnob,
};
