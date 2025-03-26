// 🎭 Vue
import { ref } from "vue";

// 🎛️ MIDI & WebMidi
import { WebMidi, Output, Input } from "webmidi";
import type { MessageEvent } from "webmidi";

// 🎸 NUX MG-30 SysEx Commands & Responses
import {
  CURRENT_PRESET_DATA_COMMAND,
  SAVE_CURRENT_PRESET_DATA_COMMAND,
  SysExRequest,
} from "../utils/NUXSysExCommands";

// 📦 Types
import type { EffectOption } from "../types";

// 🎚️ Effects & Mapping
import {
  determineActiveEffectBasedOnCurrentKnob,
  getAndUpdateEffectByControlKnob,
  getEffectStartOnOffByte,
} from "../utils/effectHelper";

// 🛠️ Control & Data Processing Helpers
import { hexIndex, hexToBytes } from "../utils/bytesHelper";
import * as Parser from "../parsers";

class NUXMidiController {
  private isDeviceConnected = false;
  private deviceName = "";
  private deviceVersion = ref("");
  private currentPresetBasicData = ref({});
  private currentPresetDetailData = ref({});
  private midiOutput: Output | null = null;
  private midiInput: Input | null = null;
  private selectedEffect = {};
  private selectedEffectOption = {};

  private constructor(output: Output, input: Input) {
    this.midiOutput = output;
    this.midiInput = input;
    this.isDeviceConnected = true;
    this.deviceName = output.name;

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.midiInput) return;
    // Listen for all MIDI messages (generic)
    this.midiInput.addListener("midimessage", "all", (e) => {
      console.log("Raw MIDI message:", e);
      this.handleSysExResponse(e);
    });
    this.midiInput.addListener("sysex", (event: MessageEvent) => {
      this.handleSysExResponse(event);
    });
  }

  static async create(): Promise<NUXMidiController | null> {
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
        return null;
      }

      console.log("✅ NUX MG-30 detected:", nuxOutput.name);
      const controller = new NUXMidiController(nuxOutput, nuxInput);

      controller.getDeviceVersion();
      controller.getCurrentPresetBasicData();

      window["nux"] = controller;
      return controller;
    } catch (error) {
      console.error("❌ MIDI Initialization Error:", error);
      return null;
    }
  }

  private checkDevice() {
    if (!this.isDeviceConnected) {
      console.warn("NUX MG-30 is not connected yet.");
      return;
    }
  }
  private handleSysExResponse(event: MessageEvent) {
    const data = event.data;
    const requestType = Parser.Shared.parseSysExResponse(data);

    if (!requestType) {
      console.warn("⚠️ Unknown SysEx response:", data);
      return;
    }

    console.log(`✅ ${requestType} Response matched.`);
    switch (requestType) {
      case "DEVICE_VERSION":
        this.deviceVersion.value =
          Parser.Device.extractDeviceVersion(data)?.version || "Unknown";
        break;

      case "CURRENT_PRESET_BASIC":
        this.currentPresetBasicData.value =
          Parser.Presets.extractCurrentPresetBasicData(data);
        break;
      case "CURRENT_PRESET_DETAIL":
        this.currentPresetDetailData.value =
          Parser.Presets.extractCurrentPresetDetailData(data);
        break;
      case "PRESET_CHANGED":
        // Fetch the next preset based on current preset number
        const nextPresetNumber =
          this.currentPresetBasicData.value.presetNumber + 1;

        this.getCurrentPresetBasicData();
        this.getCurrentPresetDetailData(nextPresetNumber);
        break;

      case "EFFECT_CHANGED":
        console.log("Effect changed...", data);
        // second byte determines effect type and control knob that is being changed...
        // third byte determines the actual value to be updated
        this.updateKnobValue(data[1], data[2]);
        break;
    }
  }

  public getDeviceName() {
    this.checkDevice();
    return this.deviceName;
  }

  public getDeviceVersion() {
    this.checkDevice();
    const message = hexToBytes(SysExRequest.DEVICE_VERSION);
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public getCurrentPresetBasicData() {
    this.checkDevice();
    const message = hexToBytes(SysExRequest.CURRENT_PRESET_BASIC);
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public getCurrentPresetDetailData(index: number) {
    this.checkDevice();
    const message = hexToBytes(CURRENT_PRESET_DATA_COMMAND(index));
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public changePreset(index: number) {
    this.checkDevice();
    const message = [0xc0, parseInt(hexIndex(index), 16)];
    this.midiOutput!.send(message);
  }

  public saveCurrentPreset() {
    console.log("Support coming soon");
    return;
    this.checkDevice();

    const message = hexToBytes(
      SAVE_CURRENT_PRESET_DATA_COMMAND(
        this.currentPresetBasicData?.presetNumber,
      ),
    );
    this.midiOutput!.sendSysex(67, Array.from(message));
  }

  public selectEffect(effect: EffectOption) {
    this.selectedEffect = this.currentPresetDetailData.effects[effect.category];
  }

  public selectEffectOption(effect: EffectOption, index: number | undefined) {
    if (index == null) return;
    this.toggleEffect(effect, index);
  }

  public toggleEffect(effect: EffectOption, index: number) {
    if (!effect || !effect.id) return;
    this.checkDevice(); // Ensure the device is connected

    console.log("Toggler..", effect);
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

    // Optimistically update local state
    this.updateEffectState(effect, effectId, !effect.active);

    // Send MIDI message
    try {
      const message = [0xb0, parseInt(hexIndex(index), 16), intByteToSend];

      this.midiOutput!.send(message);
      console.log(`MIDI message sent: ${message}`);
    } catch (error) {
      console.error("Error sending MIDI message", error);
      // Optionally, revert the local state change if the message failed
      this.updateEffectState(effect, effectId, effect.active);
    }
  }

  // Method to update the local state (or store) of the effect

  private updateEffectState(
    effect: EffectOption,
    effectId: string,
    isActive: boolean,
  ) {
    if (
      this.currentPresetDetailData.effects &&
      this.currentPresetDetailData.effects[effectId]
    ) {
      const effectDetail = this.currentPresetDetailData.effects[effectId];

      for (const key in effect) {
        if (effect.hasOwnProperty(key)) {
          effectDetail[key] = effect[key];
        }
      }

      effectDetail.active = isActive;
      effectDetail.id = effect.id;
      this.selectedEffectOption = effect;
    }
  }

  // Update knob value

  private updateKnobValue(ctrl: number, value: number) {
    const effects = getAndUpdateEffectByControlKnob(
      this.currentPresetDetailData.value.effects,
      ctrl,
      value,
    );

    // Always update as user might be jumping from one effect type knob to another from  Nux device
    this.selectedEffect = determineActiveEffectBasedOnCurrentKnob(ctrl);

    this.currentPresetDetailData.value = {
      ...this.currentPresetDetailData.value,
      effects: {
        ...this.currentPresetDetailData.value.effects,
        ...effects,
      },
    };
  }
}

// 🔥 Global reactive instance of the MIDI controller
const nuxMidiController = ref<NUXMidiController | null>(null);

// ✅ Auto-init when the app starts
NUXMidiController.create().then((controller) => {
  nuxMidiController.value = controller;
});
export { nuxMidiController, SysExRequest };
