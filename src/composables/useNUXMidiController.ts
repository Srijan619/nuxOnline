import { reactive, onMounted, ref } from "vue";
import { WebMidi } from "webmidi";
import type { MessageEvent } from "webmidi";

// 🎸 NUX MG-30 SysEx Commands & Responses
import {
  CURRENT_PRESET_DATA_COMMAND,
  SysExRequest,
} from "../utils/NUXSysExCommands";
import * as Parser from "../parsers";
import { hexToBytes, hexIndex } from "../utils/bytesHelper";
import {
  determineActiveEffectBasedOnCurrentKnob,
  getAndUpdateEffectByControlKnob,
  getEffectStartOnOffByte,
} from "../utils/effectHelper";

// 📦 Types
import { EffectConfig, Nux } from "../types";

export const useNUXMidiController = () => {
  const state = reactive(<Nux.NUXMidiControllerState>{
    isDeviceConnected: false,
    deviceName: "",
    deviceVersion: "",
    currentPresetData: {} as Partial<Nux.Preset>,
    selectedEffectConfig: {} as EffectConfig.Effect,
    selectedEffectOption: {} as Nux.EffectOption,
    midiOutput: null,
    midiInput: null,
    offByte: "",
    category: "" as Nux.EffectCategory,
    active: false,
    index: undefined,
    knobs: [],
  });
  const isInitialized = ref(false);

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
      // getCurrentPresetBasicData();
      // getCurrentPresetDetailData();
    } catch (error) {
      console.error("❌ MIDI Initialization Error:", error);
    }
  };

  // Set up MIDI message listeners
  const setupListeners = () => {
    if (!state.midiInput) return;

    state.midiInput.addListener("midimessage", (e: MessageEvent) => {
      console.log("Raw MIDI message:", e);
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
        state.currentPresetData = {
          ...state.currentPresetData,
          ...Parser.Presets.extractCurrentPresetDetailData(data),
        };
        break;
      case "PRESET_CHANGED":
        const nextPresetNumber = state.currentPresetData.presetNumber || 0 + 1;
        getCurrentPresetBasicData();
        getCurrentPresetDetailData(nextPresetNumber);
        break;

      case "EFFECT_CHANGED":
        console.log("Effect changed...", data);
        updateKnobValue(data[1], data[2]);
        break;
    }
  };
  // Get the device version
  const getDeviceVersion = () => {
    const message = hexToBytes(SysExRequest.DEVICE_VERSION);
    state.midiOutput?.sendSysex(0x43, Array.from(message));
  };

  // Get current preset basic data
  const getCurrentPresetBasicData = () => {
    const message = hexToBytes(SysExRequest.CURRENT_PRESET_BASIC);
    state.midiOutput?.sendSysex(0x43, Array.from(message));
  };

  // Get current preset detail data
  const getCurrentPresetDetailData = (index: number) => {
    const message = hexToBytes(CURRENT_PRESET_DATA_COMMAND(index));
    state.midiOutput?.sendSysex(0x43, Array.from(message));
  };

  // Change preset
  const changePreset = (index: number) => {
    const message = [0xc0, parseInt(hexIndex(index), 16)];
    state.midiOutput?.send(message);
  };

  // Save the current preset
  const saveCurrentPreset = () => {
    console.log("Support coming soon");
  };

  // Select an effect
  const selectEffect = (effect: Nux.EffectOption) => {
    if (!state.currentPresetData.effects) return;

    state.selectedEffectConfig = {
      ...state.currentPresetData.effects[effect.category],
      categoryColor: `var(--${state.selectedEffectConfig?.category}-color)`,
    };
  };

  // Select an effect option
  const selectEffectOption = (
    effect: Nux.EffectOption,
    index: number | undefined,
  ) => {
    if (index == null) return;
    toggleEffect(effect, index);
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

    state.selectedEffectOption = effect;
  };

  // Update knob value
  const updateKnobValue = (ctrl: number, value: number) => {
    const effects = getAndUpdateEffectByControlKnob(
      state.currentPresetData.effects,
      ctrl,
      value,
    );
    state.selectedEffectConfig = determineActiveEffectBasedOnCurrentKnob(ctrl);

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

  onMounted(() => {
    initializeController();
  });

  return {
    state,
    changePreset,
    saveCurrentPreset,
    selectEffect,
    selectEffectOption,
    toggleEffect,
  };
};
