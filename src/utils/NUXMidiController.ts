import type {
  SysExResponseData,
  Preset,
  DeviceVersion,
  Effect,
  EffectOption,
} from "../types";
import effectsMapping from "./effects";
import { SysExMockResponse } from "../mocks/mockNuxResponse";

import { WebMidi, Output, Input } from "webmidi";
import type { MessageEvent } from "webmidi";

import { ref } from "vue";

const hexIndex = (index: number) => {
  return index.toString(16).padStart(2, "0").toUpperCase();
};

const CURRENT_PRESET_DATA_COMMAND = (index: number) => {
  return `58 70 0B 00 ${hexIndex(index)} 00 00 00 00 00 00 00`;
};

//TODO: Commands needs to be hooked in to mock implementation somewhere
enum SysExRequest {
  DEVICE_VERSION = "58 00",
  CURRENT_PRESET_BASIC = "58 70 15 00",
}

const SysExResponsePattern = {
  DEVICE_VERSION: [0xf0, 0x43, 0x58, 0x10],
  CURRENT_PRESET_BASIC: [0xf0, 0x43, 0x58, 0x70, 0x15, 0x02],
  CURRENT_PRESET_DETAIL: [0xf0, 0x43, 0x58, 0x70, 0x0b, 0x02],
};

class NUXMidiController {
  private isDeviceConnected = false;
  private deviceName = "";
  private deviceVersion = ref("");
  private currentPresetBasicData = ref({});
  private currentPresetDetailData = ref({});
  private midiOutput: Output | null = null;
  private midiInput: Input | null = null;

  private constructor(output: Output, input: Input) {
    this.midiOutput = output;
    this.midiInput = input;
    this.isDeviceConnected = true;
    this.deviceName = output.name;

    // Listen for SysEx responses
    this.midiInput.addListener("sysex", (event: MessageEvent) =>
      this.handleSysExResponse(event),
    );
  }

  static async create(): Promise<NUXMidiController | null> {
    try {
      await WebMidi.enable({ sysex: true });

      const nuxOutput = WebMidi.outputs.find(
        (output) => output.name === "NUX MG-30",
      );
      const nuxInput = WebMidi.inputs.find(
        (input) => input.name === "NUX MG-30",
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
    console.log("Sysex response..", event.data);
    const data = event.data;

    // Dynamically check for the correct response type based on the SysExResponsePattern
    for (const [requestType, expectedPattern] of Object.entries(
      SysExResponsePattern,
    )) {
      const match = expectedPattern.every(
        (byte, index) => data[index] === byte,
      );

      if (match) {
        console.log(`✅ ${requestType} Response matched.`);
        switch (requestType) {
          case "DEVICE_VERSION":
            this.deviceVersion.value =
              this.extractDeviceVersion(data)?.version || "Unknown";
            break;

          case "CURRENT_PRESET_BASIC":
            console.log("🎸 Current preset basic data received!");
            this.currentPresetBasicData.value =
              this.extractCurrentPresetBasicData(data);
            break;
          case "CURRENT_PRESET_DETAIL":
            console.log("Current preset detail data received!");
            this.currentPresetDetailData.value = this.extractPresetData(data);
        }
      }
    }

    // If no match is found, log an error or handle accordingly
    console.warn("⚠️ Unknown SysEx response:", data);
  }

  public getDeviceName() {
    this.checkDevice();
    return this.deviceName;
  }

  public getDeviceVersion() {
    this.checkDevice();
    const message = this.hexToBytes(SysExRequest.DEVICE_VERSION);
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public getCurrentPresetBasicData() {
    this.checkDevice();
    const message = this.hexToBytes(SysExRequest.CURRENT_PRESET_BASIC);
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public getDetailPresetData(index: number) {
    this.checkDevice();
    const message = this.hexToBytes(CURRENT_PRESET_DATA_COMMAND(index));
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public changePreset(index: number) {
    this.checkDevice();
    const message = [0xc0, parseInt(hexIndex(index), 16)];

    this.midiOutput!.send(message);
  }

  public toggleEffect(effect: EffectOption) {
    if (!effect || !effect.id) return;
    this.checkDevice(); // Ensure the device is connected

    console.log("Toggler..", effect);
    const effectId = effect.category;

    if (!effectId) return;

    const byteToSend = effect.active ? effect.offByte : effect.onByte;

    if (!byteToSend) {
      console.error("Invalid byte value:", effect);
      return;
    }

    // Optimistically update local state
    this.updateEffectState(effectId, !effect.active);

    // Send MIDI message
    try {
      const message = [0xb0, 0x00, parseInt(byteToSend, 16)];

      this.midiOutput!.send(message);
      console.log(`MIDI message sent: ${message}`);
    } catch (error) {
      console.error("Error sending MIDI message", error);
      // Optionally, revert the local state change if the message failed
      this.updateEffectState(effectId, effect.active);
    }
  }

  // Method to update the local state (or store) of the effect
  private updateEffectState(effectId: string, isActive: boolean) {
    if (
      this.currentPresetDetailData.effects &&
      this.currentPresetDetailData.effects[effectId]
    ) {
      this.currentPresetDetailData.effects[effectId].active = isActive;
      console.log("Toggling effect..", effectId, this.currentPresetDetailData);
    }
  }

  // private sendResponse(extractedData: SysExResponseData) {
  //   // console.log("Sent SysEx Response:", this.bytesToHex(Array.from(response)));
  //   this.onMessageCallback(extractedData);
  // }

  private unitHexToBytes(response: Uint8Array): string[] {
    return Array.from(response, (byte) =>
      byte.toString(16).padStart(2, "0").toUpperCase(),
    );
  }

  private hexToBytes(hexString: string): Uint8Array {
    return new Uint8Array(hexString.split(" ").map((h) => parseInt(h, 16)));
  }

  private extractDeviceVersion(response: Uint8Array): DeviceVersion {
    if (response.length < 6) {
      console.warn("⚠️ Unexpected SysEx response length:", response);
      return { version: "Unknown" };
    }

    const versionBytes = response.slice(4, response.length - 1); // Avoid reading out of bounds
    let version = String.fromCharCode(...versionBytes).trim();

    version = version.replace(/\0+$/, "").split("MG-30")[0].trim();

    console.log(`🎸 Device version: ${version}`);
    return { version: version || "Unknown" };
  }

  // Extract basically only active preset number and active preset scene
  private extractCurrentPresetBasicData(response: Uint8Array): Partial<Preset> {
    const presetNumber = response[6];
    const presetScene = response[9];
    const preset = {
      presetNumber: presetNumber,
      activeSceneNumber: presetScene,
    };

    return preset;
  }

  private extractPresetData(response: Uint8Array): SysExResponseData {
    const data: SysExResponseData = {
      presetNumber: response[6],
      tempo: response[143] * 64 + response[144],
      parallel: response[146],
      effectOrder: response.slice(147, 165),
      name: this.extractPresetName(response.slice(165, 189)),
      scene: {
        scene1: response.slice(208, 211),
        scene2: response.slice(211, 214),
        scene3: response.slice(214, 217),
      },
      effects: this.extractEffects(response),
    };
    return data;
  }

  // Extract preset name from byte data (166-189)
  private extractPresetName(nameBytes: Uint8Array): string {
    let name = "";
    for (let i = 0; i < nameBytes.length; i += 3) {
      const char = String.fromCharCode(nameBytes[i]);
      // const code = nameBytes[i + 1];
      const secondChar = String.fromCharCode(nameBytes[i + 2] / 2);
      name += `${char}${secondChar}`;
    }
    return name.trim();
  }

  // Extract various effect data
  private extractEffects(response: Uint8Array): Effect {
    const hexValue = this.unitHexToBytes(response);

    const getEffectOption = (
      category: keyof typeof effectsMapping.effects,
      byteValue: string,
      onOffByte?: number,
    ): EffectOption => {
      const effectCategory = effectsMapping.effects[category];

      const effect = effectCategory?.options?.find(
        (data) => data.onByte === byteValue || data.offByte === byteValue,
      );

      if (!effect) {
        return {
          id: undefined,
          title: "Unknown Effect",
          onByte: "",
          offByte: "",
          category: "Unknown category",
          active: false,
        };
      }

      // onOffByte overrides onByte/offByte of object
      const effectActiveStatus = onOffByte
        ? onOffByte == 0
        : effect.onByte === byteValue;

      return {
        id: effect.id,
        title: effect.title,
        onByte: effect.onByte,
        offByte: effect.offByte,
        category: category,
        active: effectActiveStatus,
      };
    };

    //For example in some case: 8th byte is wahstatus, wah object doesn't itself have on/off (or only says wah type)

    const effects: Effect = {
      wah: getEffectOption("wah", hexValue[9], response[8]),
      comp: getEffectOption("comp", hexValue[10]),
      efx: getEffectOption("efx", hexValue[12], response[11]),
      amp: getEffectOption("amp", hexValue[13]),
      eq: getEffectOption("eq", hexValue[15], response[14]),
      gate: getEffectOption("gate", hexValue[16]),
      mod: getEffectOption("mod", hexValue[18], response[17]),
      delay: getEffectOption("delay", hexValue[19]),
      reverb: getEffectOption("reverb", hexValue[21], response[20]),
      ir: getEffectOption("ir", hexValue[22]),
      sr: getEffectOption("sr", hexValue[23]),
      vol: getEffectOption("vol", hexValue[25]),
    };

    return effects;
  }
}

// 🔥 Global reactive instance of the MIDI controller
const nuxMidiController = ref<NUXMidiController | null>(null);

// ✅ Auto-init when the app starts
NUXMidiController.create().then((controller) => {
  nuxMidiController.value = controller;
});
export { nuxMidiController, SysExRequest };
