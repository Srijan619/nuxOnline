import effectsMapping from "../effects";
import type { EffectOption } from "../types";

const typedEffectsMapping = effectsMapping as Record<string, any>;

const getEffectByIdAndCategory = (category: string, id: string | undefined) => {
  if (!category || !id) return;
  const effectCategory = typedEffectsMapping.effects[category];
  const matchedEffect = effectCategory?.options.find(
    (opt: any) => opt.id === id,
  );
  return matchedEffect;
};

const getMatchingEffectColor = (category: string, option: EffectOption) => {
  return (
    getEffectByIdAndCategory(category, option?.id)?.dominantColor ||
    `var(--${category}-color)`
  );
};

const getEffectKnobs = (category: string, option: EffectOption) => {
  return getEffectByIdAndCategory(category, option?.id)?.knobs || [];
};

export { getMatchingEffectColor, getEffectKnobs, getEffectByIdAndCategory };
