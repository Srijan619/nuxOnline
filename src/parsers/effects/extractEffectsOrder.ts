import { Nux } from "../../types";

const effectsOrderMapping: Record<number, Nux.EffectCategory> = {
  0: Nux.EffectCategory.Wah,
  1: Nux.EffectCategory.Comp,
  2: Nux.EffectCategory.Efx,
  3: Nux.EffectCategory.Amp,
  4: Nux.EffectCategory.Eq,
  5: Nux.EffectCategory.Gate,
  6: Nux.EffectCategory.Mod,
  7: Nux.EffectCategory.Delay,
  8: Nux.EffectCategory.Reverb,
  9: Nux.EffectCategory.Ir,
  10: Nux.EffectCategory.Sr,
  11: Nux.EffectCategory.Vol,
};

const getEffectIndexByCategory = (
  category: Nux.EffectCategory,
): number | undefined => {
  const index = Object.values(effectsOrderMapping).indexOf(category);
  if (index !== -1) {
    return index;
  }

  return undefined;
};

const extractEffectsOrder = (data: Uint8Array) => {
  const slicedData = data.slice(147, 165);
  const effectsOrder: Nux.EffectCategory[] = [];
  for (let i = 0; i < slicedData.length; ) {
    if (i % 3 === 0) {
      // Process single byte (like 1st, 4th, 7th, etc.)
      const effectByte = slicedData[i];
      effectsOrder.push(effectsOrderMapping[effectByte] || "Unknown");
      i++; // Move to the next index
    } else {
      // Process byte pair (like 2nd and 3rd, 5th and 6th, etc.)
      const currentByte = slicedData[i];
      const nextByte = slicedData[i + 1];
      const combinedValue = (currentByte << 8) | nextByte; // Combine two bytes
      const dividedValue = Math.floor(combinedValue / 2); // Divide by 2
      effectsOrder.push(effectsOrderMapping[dividedValue] || "Unknown");
      i += 2; // Move forward by 2 to process the next pair of bytes
    }
  }

  return effectsOrder;
};

export { extractEffectsOrder, effectsOrderMapping, getEffectIndexByCategory };
