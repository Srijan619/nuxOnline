import { reactive, ref } from "vue";
import { WebMidi } from "webmidi";
import type { MessageEvent } from "webmidi";

// 🎸 NUX MG-30 SysEx Commands & Responses
import {
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
    getPresetData(0); //FIXME: This needs to match to the one that NUX actual is showing to..
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
      break;
    case "CURRENT_PRESET_DETAIL":
      updatePresetData(data);
      break;
    case "PRESET_CHANGED":
      const nextPresetNumber = data[1];
      getPresetData(nextPresetNumber);
      break;
    case "EFFECT_CHANGED":
      const ctrl = data[1];
      const value = data[2];
      if (ctrl === 78) return; // for some reason, some control change for effect provides this..does not match any of current effect change mapping
      updateKnobValue(ctrl, value);
      break;
    case "EFFECT_ORDER_CHANGED":
      console.log("Effect order changed..refetching preset data..");
      //getPresetData();
      break;
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
  if (!index) return;
  getCurrentPresetBasicData();
  getCurrentPresetDetailData(index);
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

const updateEffectOrder = (option: Nux.EffectOption[]) => {
  state.midiOutput?.send(CURRENT_PRESET_EFFECT_ORDER_COMMAND(option));
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
  };
};
