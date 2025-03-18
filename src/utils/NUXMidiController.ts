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

//TODO: Commands needs to be hooked in to mock implementation somewhere
enum SysExRequest {
  DEVICE_VERSION = "58 00",
  CURRENT_PRESET = "F0 43 58 70 15 00 F7",
  CURRENT_PRESET_DATA = "F0 43 58 70 0B 00 00 00 00 00 00 00 00 00 F7",
}

const SysExResponsePattern = {
  DEVICE_VERSION: [0xf0, 0x43, 0x58],
};

class NUXMidiController {
  private isDeviceConnected = false;
  private deviceName = "";
  private deviceVersion = ref("");
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

      // Send the device version request after initialization
      controller.getDeviceVersion();

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
    console.log("Response..", event);
    const data = event.data;
    console.log("🔹 Received SysEx:", data);

    // Dynamically check for the correct response type based on the SysExResponsePattern
    for (const [requestType, expectedPattern] of Object.entries(
      SysExResponsePattern,
    )) {
      const match = expectedPattern.every(
        (byte, index) => data[index] === byte,
      );

      if (match) {
        console.log(`✅ ${requestType} Response matched.`);
        if (requestType === "DEVICE_VERSION") {
          this.deviceVersion.value = this.extractDeviceVersion(data)?.version;
        }
        return;
      }
    }

    // If no match is found, log an error or handle accordingly
    console.warn("⚠️ Unknown SysEx response:", data);
  }

  private preparePresetData(index: number, type: "basic" | "detail") {
    this.checkDevice();
    const presetData = SysExMockResponse[index];
    if (!presetData) {
      console.warn(`Preset data for index ${index} not found.`);
      return;
    }

    const sysExMessage = presetData[type];
    if (!sysExMessage) {
      console.warn(`No ${type} SysEx message found for index ${index}.`);
      return;
    }

    const response = this.hexToBytes(sysExMessage);
    return response;
  }

  public getDeviceName() {
    this.checkDevice();
    return this.deviceName;
  }

  public getDeviceVersion() {
    this.checkDevice();
    console.log("🔹 Requesting device version...");
    const message = this.hexToBytes(SysExRequest.DEVICE_VERSION);
    this.midiOutput!.sendSysex(0x43, Array.from(message));
  }

  public getBasicPresetData(index: number) {
    this.checkDevice();
    const data = this.preparePresetData(index, "basic");
    if (!data) return;
    return this.extractCurrentPreset(data);
  }

  public getDetailPresetData(index: number) {
    this.checkDevice();
    const data = this.preparePresetData(index, "detail");
    if (!data) return;
    return this.extractPresetData(data);
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
  private extractCurrentPreset(response: Uint8Array): Partial<Preset> {
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
        category: effectCategory.category,
        active: effectActiveStatus,
      };
    };

    //For example in some case: 8th byte is wahstatus, wah object doesn't itself have on/off (or only says wah type)
    const effects: Effect = {
      wah: getEffectOption("wah", hexValue[8], response[7]),
      comp: getEffectOption("cmp", hexValue[9]),
      efx: getEffectOption("efx", hexValue[11], response[10]),
      amp: getEffectOption("amp", hexValue[12]),
      eq: getEffectOption("eq", hexValue[14], response[13]),
      gate: getEffectOption("gate", hexValue[15]),
      mod: getEffectOption("mod", hexValue[17], response[16]),
      delay: getEffectOption("delay", hexValue[18]),
      reverb: getEffectOption("reverb", hexValue[20], response[19]),
      ir: getEffectOption("ir", hexValue[21]),
      sr: getEffectOption("sr", hexValue[22]),
      vol: getEffectOption("vol", hexValue[24]),
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
