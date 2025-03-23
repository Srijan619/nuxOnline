import effectsMapping from "../effects";

const typedEffectsMapping = effectsMapping as Record<string, any>;

const getEffectByIdAndCategory = (category: string, id: string | undefined) => {
  if (!category || !id) return;
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

export { getMatchingEffectColor, getEffectKnobs, getEffectByIdAndCategory };
