import type { BaseEffectOption, EffectCategory } from "./types";

interface EffectOption extends BaseEffectOption {
  dominantColor?: string;
}

interface Effect {
  byte?: number; //TODO: Get rid of this perhaps..
  category: EffectCategory;
  startOffByte?: string;
  startOnByte?: string;
  categoryColor?: string; //TODO: Optional color for effect option..but is this a good way?
  options?: EffectOption[];
}

type EffectType = {
  [K in EffectCategory]: Effect;
};

export type { EffectType, Effect };
