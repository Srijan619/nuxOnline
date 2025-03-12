interface Effect {
  wahStatus: "On" | "Off";
  wahType: number;
  compTypeStatus: number;
  efxStatus: "On" | "Off";
  efxType: number;
  ampStatus: number;
  eqStatus: "On" | "Off";
  eqType: number;
  gateStatus: number;
  modStatus: "On" | "Off";
  modType: number;
  delayTypeStatus: number;
  reverbStatus: "On" | "Off";
  reverbType: number;
  irTypeStatus: number;
  srStatus: "On" | "Off";
  volStatus: number;
  effectParams: number[];
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

export type { Effect, Scene, Preset, SysExResponseData, DeviceVersion };
