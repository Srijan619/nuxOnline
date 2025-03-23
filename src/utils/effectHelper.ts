import effectsMapping from "../effects";
import type { EffectOption, KnobEntry, KnobsConfig } from "../types";

const getMainEffectGroup = (effectOption: EffectOption) => {
  const typedEffectsMapping = effectsMapping as Record<string, any>;

  const effectCategory = typedEffectsMapping.effects[effectOption?.category];
  const matchedEffect = effectCategory?.options.find(
    (opt: any) => opt.id === effectOption?.id,
  );
  return matchedEffect;
};

const getMatchingEffectColor = (effectOption: EffectOption) => {
  return (
    getMainEffectGroup(effectOption)?.dominantColor ||
    `var(--${effectOption?.category}-color)`
  );
};

const getEffectKnobs = (effectOption: EffectOption) => {
  return getMainEffectGroup(effectOption)?.knobs || [];
};

const populateKnobs = (
  knobData: KnobEntry[],
  startCtrl: number,
): KnobsConfig => {
  return {
    knobs: knobData?.map(([id, title, range], index) => ({
      id,
      title,
      range: range || [0, 100],
      ctrl: startCtrl + index,
    })),
  };
};

const getEffectStartOnOffByte = (category: string, id: string) => {
  if (!category || !id) return;
  const typedEffectsMapping = effectsMapping as Record<string, any>;

  const effectCategory = typedEffectsMapping.effects[category];
  const effectIndex = effectCategory.options.findIndex(
    (opt: any) => opt.id === id,
  );
  const matchedEffect = effectCategory?.options.find(
    (opt: any) => opt.id === id,
  );

  if (!effectCategory?.startOnByte || !effectCategory?.startOffByte)
    return {
      startOnByte: matchedEffect?.onByte,
      startOffByte: matchedEffect?.offByte,
    };

  const startOnByte = calculateByte(effectCategory?.startOnByte, effectIndex);
  const startOffByte = calculateByte(effectCategory?.startOffByte, effectIndex);

  return {
    startOnByte,
    startOffByte,
  };
};

const getEffectByControlKnob = (ctrl: number) => {
  const typedEffectsMapping = effectsMapping as Record<string, any>;

  for (const [effectKey, effectValue] of Object.entries(
    typedEffectsMapping.effects,
  )) {
    const matchedOption = effectValue?.options?.find((option: any) => {
      return option?.knobs?.find((knob: any) => knob.ctrl === ctrl);
    });

    if (matchedOption) {
      return { ...matchedOption, category: effectKey };
    }
  }
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
  getEffectByControlKnob,
};
