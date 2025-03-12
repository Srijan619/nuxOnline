import type {
  SysExResponseData,
  Preset,
  DeviceVersion,
  Effect,
  EffectOption,
} from "../types";
import effectsMapping from "./effects";

export enum SysExRequest {
  DEVICE_VERSION = "F0 43 58 00 F7",
  CURRENT_PRESET = "F0 43 58 70 15 00 F7",
  CURRENT_PRESET_DATA = "F0 43 58 70 0B 00 00 00 00 00 00 00 00 00 F7",
}

enum SysExResponse {
  DEVICE_VERSION = "F0 43 58 10 76 34 2E 30 2E 33 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 4D 47 2D 33 30 00 00 00 F7",
  CURRENT_PRESET = "F0 43 58 70 15 02 00 00 64 00 00 00 00 00 F7",
  CURRENT_PRESET_DATA = "F0 43 58 70 0B 02 00 01 02 43 01 0A 02 01 02 01 01 02 42 00 04 14 01 02 01 00 00 32 02 00 04 00 68 25 00 4E 46 00 06 00 01 24 55 00 00 00 00 00 07 00 50 61 00 10 23 00 40 24 00 7E 4C 00 0E 3F 00 64 20 00 64 31 00 5E 32 00 64 32 00 64 32 00 64 02 00 28 32 00 00 00 00 08 3B 00 7E 24 03 2C 00 00 00 04 00 28 28 00 4F 55 00 00 00 00 00 00 00 08 4D 00 76 55 00 5A 06 00 00 00 00 64 00 01 48 00 00 04 32 00 64 02 00 00 64 00 64 00 00 00 62 00 00 00 00 02 05 00 04 03 00 12 04 00 14 06 00 0E 08 00 16 41 01 04 43 01 08 31 00 64 33 00 68 5B 01 38 5D 01 3C 61 01 44 63 01 48 0A 00 10 09 00 02 05 00 00 64 00 00 64 00 00 00 01 20 00 00 50 0B 00 78 0A 00 00 00 F7",
}

const SYSEX_RESPONSES: Record<SysExRequest, SysExResponse> = {
  [SysExRequest.DEVICE_VERSION]: SysExResponse.DEVICE_VERSION,
  [SysExRequest.CURRENT_PRESET]: SysExResponse.CURRENT_PRESET,
  [SysExRequest.CURRENT_PRESET_DATA]: SysExResponse.CURRENT_PRESET_DATA,
};

export class MIDIMock {
  private onMessageCallback: (
    msg: Uint8Array,
    extractedData: SysExResponseData,
  ) => void;

  constructor(
    onMessage: (msg: Uint8Array, extractedData: SysExResponseData) => void,
  ) {
    this.onMessageCallback = onMessage;
  }

  public receiveMessage(request: SysExRequest) {
    console.log("Received SysEx:", request);

    const responseStr = SYSEX_RESPONSES[request];
    if (responseStr) {
      const response = this.hexToBytes(responseStr);
      console.log("Matching SysEx detected. Sending response...");
      const extractedData = this.extractDataFromResponse(request, response);

      this.sendResponse(response, extractedData);
    } else {
      console.log("No matching SysEx response found.");
    }
  }

  private sendResponse(response: Uint8Array, extractedData: SysExResponseData) {
    console.log("Sent SysEx Response:", this.bytesToHex(Array.from(response)));
    this.onMessageCallback(response, extractedData);
  }

  private bytesToHex(bytes: number[]): string {
    return bytes
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");
  }

  private hexToBytes(hexString: string): Uint8Array {
    return new Uint8Array(hexString.split(" ").map((h) => parseInt(h, 16)));
  }

  private extractDataFromResponse(
    request: SysExRequest,
    response: Uint8Array,
  ): SysExResponseData {
    switch (request) {
      case SysExRequest.DEVICE_VERSION:
        return this.extractDeviceVersion(response);
      case SysExRequest.CURRENT_PRESET:
        return this.extractCurrentPreset(response);
      case SysExRequest.CURRENT_PRESET_DATA:
        return this.extractPresetData(response);
      default:
        console.log("No extraction logic defined for this request.");
        return "Unknown response format";
    }
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
      const code = nameBytes[i + 1];
      const secondChar = String.fromCharCode(nameBytes[i + 2] / 2);
      name += `${char}${secondChar}`;
    }
    return name.trim();
  }

  // Extract various effect data
  private extractEffects(response: Uint8Array): Effect {
    const getEffectOption = (
      category: keyof typeof effectsMapping.effects,
      byteValue: number,
      active: boolean,
    ): EffectOption => {
      const effectCategory = effectsMapping.effects[category];

      const effect = effectsMapping.effects[category]?.options?.find(
        (data) => parseInt(data.onByte, 16) === byteValue,
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
      return {
        id: effect.id,
        title: effect.title,
        onByte: effect.onByte,
        offByte: effect.offByte,
        category: effectCategory.category,
        active: active,
      };
    };
    const effects: Effect = {
      wah: getEffectOption("wah", response[8], response[7] === 0),
      comp: getEffectOption("cmp", response[9], response[9] === 0),
      efx: getEffectOption("cmp", response[11], response[10] === 0),
      amp: getEffectOption("amp", response[12], response[12] === 0),
      eq: getEffectOption("cmp", response[14], response[13] === 0),
      gate: getEffectOption("cmp", response[15], response[15] === 0),
      mod: getEffectOption("cmp", response[17], response[16] === 0),
      delay: getEffectOption("cmp", response[18], response[18] === 0),
      reverb: getEffectOption("cmp", response[20], response[19] === 0),
      ir: getEffectOption("cmp", response[21], response[21] === 0),
      // effectParams: Array.from(response.slice(27, 138)),
    };
    return effects;
  }
}
