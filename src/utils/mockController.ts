import type {
  SysExResponseData,
  Preset,
  DeviceVersion,
  Effect,
  EffectOption,
} from "../types";
import effectsMapping from "./effects";
import { SysExMockResponse } from "../mocks/mockNuxResponse";

//TODO: Commands needs to be hooked in to mock implementation somewhere
enum SysExRequest {
  DEVICE_VERSION = "F0 43 58 00 F7",
  CURRENT_PRESET = "F0 43 58 70 15 00 F7",
  CURRENT_PRESET_DATA = "F0 43 58 70 0B 00 00 00 00 00 00 00 00 00 F7",
}

enum SysExResponse {
  DEVICE_VERSION = "F0 43 58 10 76 34 2E 30 2E 33 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 4D 47 2D 33 30 00 00 00 F7",
}

class NUXMockMidiController {
  constructor() { }

  private preparePresetData(index: number, type: "basic" | "detail") {
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

  public getDeviceVersion() {
    const mockDeviceVersionResponse = SysExResponse.DEVICE_VERSION;
    const response = this.hexToBytes(mockDeviceVersionResponse);
    return this.extractDeviceVersion(response);
  }

  public getBasicPresetData(index: number) {
    const data = this.preparePresetData(index, "basic");
    if (!data) return;
    return this.extractCurrentPreset(data);
  }

  public getDetailPresetData(index: number) {
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
    const versionBytes = response.slice(4, 10);
    let version = String.fromCharCode(...versionBytes);
    console.log(`🎸 Device version: ${version}`);
    return { version: version.trim() };
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
      comp: getEffectOption("comp", hexValue[9]),
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

const nuxMidiMockController = new NUXMockMidiController();
export { nuxMidiMockController, SysExRequest };
