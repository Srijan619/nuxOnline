import effectsMapping from "../effects";
import type {
  Effect,
  EffectOption,
  Knob,
  KnobEntry,
  KnobsConfig,
} from "../types";

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

const getAndUpdateEffectByControlKnob = (
  effects: Effect,
  ctrl: number,
  value: number,
) => {
  for (const [_, effectValue] of Object.entries(effects)) {
    const matchedKnob = effectValue?.knobs?.find((knob: Knob) => {
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

const determineActiveEffectBasedOnCurrentKnob = (ctrl: number) => {
  const typedEffectsMapping = effectsMapping as Record<string, any>;

  for (const [_, effectValue] of Object.entries(typedEffectsMapping.effects)) {
    const matchedOption = effectValue?.options?.find((opt: EffectOption) =>
      opt?.knobs?.some((knob: Knob) => knob.ctrl === ctrl),
    );
    if (matchedOption) {
      return effectValue;
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
  getAndUpdateEffectByControlKnob,
  determineActiveEffectBasedOnCurrentKnob,
};
