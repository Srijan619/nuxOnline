import effectsMapping from "../effects";
import type { KnobEntry, KnobsConfig } from "../types";

const getEffectByIdAndCategory = (category: string, id: string | undefined) => {
  if (!category || !id) return;
  const typedEffectsMapping = effectsMapping as Record<string, any>;

  const effectCategory = typedEffectsMapping.effects[category];
  const matchedEffect = effectCategory?.options.find(
    (opt: any) => opt.id === id,
  );
  return matchedEffect;
};

const getMatchingEffectColor = (category: string, id: string) => {
  return (
    getEffectByIdAndCategory(category, id)?.dominantColor ||
    `var(--${category}-color)`
  );
};

const getEffectKnobs = (category: string, id: string) => {
  return getEffectByIdAndCategory(category, id)?.knobs || [];
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

export {
  getMatchingEffectColor,
  getEffectKnobs,
  getEffectByIdAndCategory,
  populateKnobs,
};
