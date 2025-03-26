import { Output, Input } from "webmidi";
import type { EffectConfig } from ".";

enum EffectCategory {
  Wah = "wah",
  Comp = "comp",
  Efx = "efx",
  Amp = "amp",
  Eq = "eq",
  Gate = "gate",
  Mod = "mod",
  Delay = "delay",
  Reverb = "reverb",
  Ir = "ir",
  Sr = "sr",
  Vol = "vol",
}

interface NUXMidiControllerState {
  isDeviceConnected: boolean;
  deviceName: string;
  deviceVersion: string;
  currentPresetData: Partial<Preset>;
  selectedEffectConfig: EffectConfig.Effect | undefined;
  selectedEffectOption: EffectOption;
  midiOutput: Output | null;
  midiInput: Input | null;
  offByte: string;
  category: EffectCategory;
  active: boolean;
  index: number | undefined; // defines order
  knobs?: Knob[];
}

interface BaseEffectOption {
  id: string | undefined;
  title: string;
  onByte: string;
  offByte: string;
  knobs?: Knob[]; //FIXME: This should be mandatory..as all mappings are not done yet so marked it as optional..
}

interface EffectOption extends BaseEffectOption {
  category: EffectCategory;
  active: boolean;
  index: number | undefined; //defines order
}

type Effect = {
  [K in EffectCategory]: EffectOption;
};

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

type SysExResponseData = DeviceVersion | Preset | Partial<Preset>;

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
  EffectCategory,
  Scene,
  Preset,
  SysExResponseData,
  DeviceVersion,
  KnobEntry,
  Knob,
  KnobsConfig,
  BaseEffectOption,
  EffectOption,
  NUXMidiControllerState,
};
