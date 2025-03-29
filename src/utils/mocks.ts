import { EffectCategory } from "../types/types";

const mockEffectList = [
  {
    id: "effect0",
    title: "AMP",
    category: EffectCategory.Amp,
    active: true,
  },
  {
    id: "effect1",
    title: "Overdrive",
    category: EffectCategory.Efx,
    active: true,
  },
  {
    id: "effect11",
    title: "Wah",
    category: EffectCategory.Wah,
    active: false,
  },
  {
    id: "effect22",
    title: "Compressor",
    category: EffectCategory.Comp,
    active: false,
  },
  {
    id: "effect2",
    title: "Chorus",
    category: EffectCategory.Mod,
    active: false,
  },
  {
    id: "effect3",
    title: "Delay",
    category: EffectCategory.Delay,
    active: true,
  },
  {
    id: "effect4",
    title: "Reverb",
    category: EffectCategory.Reverb,
    active: false,
  },
  {
    id: "effect5",
    title: "EQ",
    category: EffectCategory.Eq,
    active: true,
  },
  {
    id: "effect7",
    title: "SR",
    category: EffectCategory.Sr,
    active: true,
  },
  {
    id: "effect6",
    title: "IR",
    category: EffectCategory.Ir,
    active: false,
  },
  {
    id: "effect8",
    title: "Vol",
    category: EffectCategory.Vol,
    active: true,
  },
];

export { mockEffectList };
