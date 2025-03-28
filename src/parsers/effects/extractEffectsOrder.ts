import { Nux } from "../../types";

const effectsOrderMapping: Record<number, Nux.EffectCategory | string> = {
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
const extractEffectsOrder = (data: Uint8Array) => {
  const slicedData = data.slice(147, 165);
  const effectsOrder = [];

  console.log("Raw effect order data", slicedData);

  for (let i = 0; i < slicedData.length; ) {
    if (i % 3 === 0) {
      // If we are at an index where a single byte is required
      const effectByte = slicedData[i];
      effectsOrder.push(effectsOrderMapping[effectByte] || "Unknown");
      i++; // Move to the next index
    } else {
      // If it's an index where two bytes should be combined (2nd and 3rd, 5th and 6th, etc.)
      const currentByte = slicedData[i];
      const nextByte = slicedData[i + 1];
      const combinedValue = currentByte + nextByte;
      const dividedValue = Math.floor(combinedValue / 2);
      effectsOrder.push(effectsOrderMapping[dividedValue] || "Unknown");
      i += 2; // Move forward by 2 to process the next pair of bytes
    }
  }

  return effectsOrder;
};

export { extractEffectsOrder };
