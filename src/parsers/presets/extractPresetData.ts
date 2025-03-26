// 📦 Types
import type { SysExResponseData, Preset } from "../../types";
// 🛠️ Control & Data Processing Helpers
import * as Parser from "../../parsers";

// Extract basically only active preset number and active preset scene
function extractCurrentPresetBasicData(response: Uint8Array): Partial<Preset> {
  const presetNumber = response[6];
  const presetScene = response[9];
  const preset = {
    presetNumber: presetNumber,
    activeSceneNumber: presetScene,
  };

  return preset;
}

function extractCurrentPresetDetailData(
  response: Uint8Array,
): SysExResponseData {
  const data: SysExResponseData = {
    presetNumber: response[6],
    tempo: response[143] * 64 + response[144],
    parallel: response[146],
    effectOrder: response.slice(147, 165),
    name: Parser.Presets.extractPresetName(response.slice(165, 189)),
    scene: {
      scene1: response.slice(208, 211),
      scene2: response.slice(211, 214),
      scene3: response.slice(214, 217),
    },
    effects: Parser.Effects.extractEffects(response),
  };
  return data;
}

export { extractCurrentPresetBasicData, extractCurrentPresetDetailData };
