import { reactive, ref } from "vue";
import { WebMidi } from "webmidi";
import type { MessageEvent } from "webmidi";

// 🎸 NUX MG-30 SysEx Commands & Responses
import {
  CHANGE_SCENE_COMMAND,
  CURRENT_PRESET_EFFECT_ORDER_COMMAND,
  PRESET_DATA_COMMAND,
  SysExRequest,
} from "../utils/NUXSysExCommands";
import * as Parser from "../parsers";
import { hexToBytes, hexIndex } from "../utils/bytesHelper";
import {
  determineActiveEffectBasedOnCurrentKnob,
  getAndUpdateEffectByControlKnob,
  getEffectStartOnOffByte,
  getMatchingEffectColor,
} from "../utils/effectHelper";

// 📦 Types
import { Nux } from "../types";
import EFFECT_CONFIG from "../effects";
import {
  effectsOrderMapping,
  extractEffectsOrder,
} from "../parsers/effects/extractEffectsOrder";
import { EffectCategory } from "../types/types";

const state = reactive(<Nux.NUXMidiControllerState>{
  isDeviceConnected: false,
  deviceName: "",
  deviceVersion: "",
  currentPresetData: {} as Partial<Nux.Preset>,
  selectedEffectOption: {} as Nux.EffectOption,
  midiOutput: null,
  midiInput: null,
  active: false,
  isFetchingPresets: false,
  presets: [],
});

const isInitialized = ref(false);
let isListenersAttached = false;

// Initialize the MIDI controller
const initializeController = async () => {
  if (isInitialized.value) return;

  try {
    await WebMidi.enable({ sysex: true });

    const nuxOutput = WebMidi.outputs.find((output) =>
      output.name.includes("NUX MG-30"),
    );
    const nuxInput = WebMidi.inputs.find((input) =>
      input.name.includes("NUX MG-30"),
    );

    if (!nuxOutput || !nuxInput) {
      console.error("❌ NUX MG-30 not found. Controller not created.");
      return;
    }

    console.log("✅ NUX MG-30 detected:", nuxOutput.name);
    state.deviceName = nuxOutput.name;
    state.midiOutput = nuxOutput;
    state.midiInput = nuxInput;
    state.isDeviceConnected = true;

    setupListeners();
    getDeviceVersion();
    getAllPresets();

    window["nux"] = state;
  } catch (error) {
    console.error("❌ MIDI Initialization Error:", error);
  }
};

const getAllPresets = (i = 0) => {
  // Start fetching presets
  if (i === 0) state.isFetchingPresets = true;

  if (i > 127) {
    // Stop fetching when reaching preset 128 and set fetching state to false
    state.isFetchingPresets = false;
    //  Get current preset basic data and then after that only fet the all data..
    getCurrentPresetBasicData(); //FIXME: This needs to match to the one that NUX actual is showing to..
    return;
  }
  getCurrentPresetDetailData(i);

  setTimeout(() => getAllPresets(i + 1), 1);
};

// Set up MIDI message listeners
const setupListeners = () => {
  if (!state.midiInput || isListenersAttached) return;
  isListenersAttached = true;

  state.midiInput.addListener("midimessage", (e: MessageEvent) => {
    console.log("midimessage..", e);
    handleSysExResponse(e);
  });
  state.midiInput.addListener("sysex", (event: MessageEvent) => {
    handleSysExResponse(event);
  });
};

// Handle incoming SysEx messages
const handleSysExResponse = (event: MessageEvent) => {
  const data = event.data;
  const requestType = Parser.Shared.parseSysExResponse(data);

  if (!requestType) {
    console.warn("⚠️ Unknown SysEx response:", data);
    return;
  }

  console.log(`✅ ${requestType} Response matched.`);
  switch (requestType) {
    case "DEVICE_VERSION":
      if (state.deviceVersion) return;
      state.deviceVersion =
        Parser.Device.extractDeviceVersion(data)?.version || "Unknown";
      break;
    case "CURRENT_PRESET_BASIC":
      state.currentPresetData =
        Parser.Presets.extractCurrentPresetBasicData(data);
      getCurrentPresetDetailData(state.currentPresetData.presetNumber);
      break;
    case "CURRENT_PRESET_DETAIL":
      updatePresetData(data);
      break;
    case "SCENE_CHANGED":
      updateScene(data);
      break;
    case "PRESET_CHANGED":
      const nextPresetNumber = data[1];
      getPresetData(nextPresetNumber);
      break;
    case "EFFECT_CHANGED":
      handleEffectChanged(data);
      break;
    case "EFFECT_ORDER_CHANGED":
      console.log(
        "Effect order changed signal received..refetching preset data..",
      );
      requestUpdatedEffectsOrder();
      //We need to do ourselves optimistic update as NUX does not actually save when effect order is changed, so getting latest data does not help
      //getPresetData();
      break;
    case "UPDATED_EFFECTS_ORDER":
      state.currentPresetData.effectsOrder = extractEffectsOrder(data);
  }
};
// Get the device version
const getDeviceVersion = () => {
  const message = hexToBytes(SysExRequest.DEVICE_VERSION);
  state.midiOutput?.sendSysex(0x43, Array.from(message));
};

const getPresetData = (
  index: number | undefined = state.currentPresetData?.presetNumber,
) => {
  if (index === undefined) return;
  getCurrentPresetBasicData();
};

// Get current preset basic data
const getCurrentPresetBasicData = () => {
  const message = hexToBytes(SysExRequest.CURRENT_PRESET_BASIC);
  state.midiOutput?.sendSysex(0x43, Array.from(message));
};

// Get current preset detail data
const getCurrentPresetDetailData = (index: number) => {
  const message = hexToBytes(PRESET_DATA_COMMAND(index));
  state.midiOutput?.sendSysex(0x43, Array.from(message));
};

// Change preset
const changePreset = (index: number) => {
  state.midiOutput?.sendProgramChange(index);
  getCurrentPresetBasicData();
  getCurrentPresetDetailData(index);
  state.selectedEffectOption = {} as Nux.EffectOption;
};

// Save the current preset
const saveCurrentPreset = () => {
  console.log("Support coming soon");
};

// Select an effect category (it is like temp selection before selecting the effect)
const selectEffectOption = (effect: Nux.EffectOption) => {
  if (!state.currentPresetData.effects) return;

  state.selectedEffectOption = {
    ...state.currentPresetData.effects[effect.category],
    categoryColor: `var(--${effect.category}-color)`,
    dominantColor: getMatchingEffectColor(effect),
  };
};

// Toggle effect on/off
const toggleEffect = (effect: Nux.EffectOption, index: number) => {
  if (!effect || !effect.id) return;

  const effectId = effect.category;

  if (!effectId) return;

  const { startOnByte, startOffByte } = getEffectStartOnOffByte(
    effect.category,
    effect.id,
  );
  const byteToSend = effect.active ? startOffByte : startOnByte;

  if (!byteToSend) {
    console.error("Invalid byte value:", effect);
    return;
  }

  let intByteToSend = parseInt(byteToSend, 16);

  const exclusive = ["wah"];
  intByteToSend =
    exclusive.includes(effect.category) && !effect.active
      ? intByteToSend / 2
      : intByteToSend;

  updateEffectState(effect, effectId, !effect.active);

  try {
    const message = [0xb0, parseInt(hexIndex(index), 16), intByteToSend];
    state.midiOutput?.send(message);
    console.log(`MIDI message sent: ${message}`);
  } catch (error) {
    console.error("Error sending MIDI message", error);
    updateEffectState(effect, effectId, effect.active);
  }
};

// Update effect state locally
const updateEffectState = (
  effect: Nux.EffectOption,
  effectId: Nux.EffectCategory,
  isActive: boolean,
) => {
  if (!state.currentPresetData.effects) return;

  const effectDetail = state.currentPresetData.effects[effectId];
  if (!effectDetail) return;

  state.currentPresetData.effects[effectId] = {
    ...effectDetail,
    ...effect,
    active: isActive,
    id: effect.id,
  };

  const effectCategory = EFFECT_CONFIG[effect.category];

  if (!effectCategory) return;

  state.selectedEffectOption = {
    ...state.selectedEffectOption,
    ...effect,
    options: effectCategory.options ?? [],
  };
};

const handleEffectChanged = (data: Uint8Array<ArrayBufferLike>) => {
  const secondByte = data[1];
  const thirdByte = data[2];
  if (secondByte === 78) return; // for some reason, some control change for effect provides this..does not match any of current effect change mapping

  if (secondByte === 77) {
    // Effect selection changed from one to another..
    const category = effectsOrderMapping[thirdByte];

    if (!state.currentPresetData.effects) return;
    state.selectedEffectOption = state.currentPresetData.effects[category];
  }
  if (secondByte >= 1 && secondByte <= 16) {
    // Means effect is being changed from NUX
    // second byte determines effect type and third is the exact effect
    const category = effectsOrderMapping[secondByte];
    if (!category) return;
    if (!EFFECT_CONFIG[category] || !EFFECT_CONFIG[category].options) return;
    const effectOption = EFFECT_CONFIG[category]?.options[thirdByte - 1];
    state.selectedEffectOption = {
      ...state.selectedEffectOption,
      ...effectOption,
    };
    console.log("NUX CHANGED EFFECT..", category, effectOption);
  } else {
    updateKnobValue(secondByte, thirdByte);
  }
};
// Update knob value
const updateKnobValue = (ctrl: number, value: number) => {
  const activeEffect = determineActiveEffectBasedOnCurrentKnob(ctrl);
  if (!activeEffect) return; // No action if control values can not be found...
  console.log("Effect changed...", ctrl, value);

  const effects = getAndUpdateEffectByControlKnob(
    state.currentPresetData.effects,
    ctrl,
    value,
  );
  //state.selectedEffectOption = activeEffect;
  if (state.currentPresetData.effects) {
    state.currentPresetData = {
      ...state.currentPresetData,
      effects: {
        ...state.currentPresetData.effects,
        ...effects,
      },
    };
  }
};

const updatePresetData = (data: Uint8Array<ArrayBufferLike>) => {
  const newPreset = {
    ...state.currentPresetData,
    ...Parser.Presets.extractCurrentPresetDetailData(data),
  };

  const existingIndex = state.presets.findIndex(
    (p: Nux.Preset) => p.presetNumber === newPreset.presetNumber,
  );

  if (existingIndex !== -1) {
    // Update existing preset
    state.presets[existingIndex] = newPreset;
  } else {
    // Add new preset
    state.presets.push(newPreset);
  }

  state.currentPresetData = newPreset;
};

// Effects order
const updateEffectOrder = (option: Nux.EffectOption[]) => {
  updateLocalEffectsAfterEffectOrderChanged(option);
  state.midiOutput?.send(CURRENT_PRESET_EFFECT_ORDER_COMMAND(option));
};

const updateLocalEffectsAfterEffectOrderChanged = (
  option: Nux.EffectOption[],
) => {
  state.currentPresetData.effectsOrder = [];
  option.forEach((option) => {
    if (!state.currentPresetData.effectsOrder) return;
    state.currentPresetData.effectsOrder.push(option.category);
  });
};

const requestUpdatedEffectsOrder = () => {
  const message = hexToBytes(SysExRequest.REQUEST_UPDATED_EFFECT_ORDER_COMMAND);
  state.midiOutput?.sendSysex(0x43, Array.from(message));
};

// Scenes

const updateScene = (data: Uint8Array<ArrayBufferLike>) => {
  state.currentPresetData.activeSceneNumber = data[2];
};

const changeScene = (sceneNumber: number) => {
  state.currentPresetData.activeSceneNumber = sceneNumber;
  state?.midiOutput?.send(CHANGE_SCENE_COMMAND(sceneNumber));
};

const mapDataBackToNUXFormat = () => {
  if (!state.currentPresetData.presetNumber) return;

  const base = ["F0", "43", "58", "70", "0B", "02"];
  base.push(hexIndex(state.currentPresetData.presetNumber));

  const addEffectBytes = (effectKey: EffectCategory) => {
    const effect = state.currentPresetData.effects?.[effectKey];
    if (!effect) return;

    const statusByte = effect.active ? "00" : "01";
    const typeByte = effect.active ? effect.onByte : effect.offByte;

    if (!typeByte) return;

    base.push(statusByte, typeByte);
  };

  // Ensure EffectCategory is an enum or valid union type
  const effectKeys: EffectCategory[] = [
    EffectCategory.Wah,
    EffectCategory.Comp,
    EffectCategory.Efx,
    EffectCategory.Amp,
    EffectCategory.Eq,
    EffectCategory.Gate,
    EffectCategory.Mod,
    EffectCategory.Delay,
    EffectCategory.Reverb,
    EffectCategory.Ir,
    EffectCategory.Sr,
    EffectCategory.Vol,
  ];

  effectKeys.forEach(addEffectBytes);

  // Two empty bytes
  base.push("00");
  base.push("00");
};

// TODO: webmidi api says not to use this directly, so lets think about that later..
const sendRawSysEx = (ctrl: number, value: number) => {
  console.log("Sending raw sysex..", ctrl, value);
  state?.midiOutput?.send([176, ctrl, value]);
};

export const useNUXMidiController = () => {
  return {
    state,
    initializeController,
    changePreset,
    saveCurrentPreset,
    selectEffectOption,
    toggleEffect,
    sendRawSysEx,
    updateEffectOrder,
    changeScene,
  };
};
