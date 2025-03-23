export interface EffectOption {
  id: string | undefined;
  title: string;
  onByte: string;
  offByte: string;
  category: string;
  active: boolean;
  index: number | undefined; //defines order
  knobs: Knob[];
}

interface Effect {
  wah: EffectOption;
  comp: EffectOption;
  efx: EffectOption;
  amp: EffectOption;
  eq: EffectOption;
  gate: EffectOption;
  mod: EffectOption;
  delay: EffectOption;
  reverb: EffectOption;
  ir: EffectOption;
  sr: EffectOption;
  vol: EffectOption;
  // effectParams: number[];
}

interface Scene {
  scene1: Uint8Array;
  scene2: Uint8Array;
  scene3: Uint8Array;
}

interface Preset {
  presetNumber: number;
  tempo: number;
  parallel: number;
  effectOrder: Uint8Array;
  name: string;
  scene: Scene;
  activeSceneNumber?: number;
  effects: Effect;
}

interface DeviceVersion {
  version: string;
}

type SysExResponseData = DeviceVersion | Preset | Partial<Preset> | string;

type KnobEntry = [string, string, [number, number]?];

interface Knob {
  id: string;
  title: string;
  range: [number, number];
  ctrl: number;
  currentValue?: number;
}

interface KnobsConfig {
  knobs: Knob[];
}

export type {
  Effect,
  Scene,
  Preset,
  SysExResponseData,
  DeviceVersion,
  KnobEntry,
  Knob,
  KnobsConfig,
};
