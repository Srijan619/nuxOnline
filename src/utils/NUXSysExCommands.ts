import { hexIndex } from "./bytesHelper";

const CURRENT_PRESET_DATA_COMMAND = (index: number) => {
  return `58 70 0B 00 ${hexIndex(index)} 00 00 00 00 00 00 00`;
};

const SAVE_CURRENT_PRESET_DATA_COMMAND = (index: number) => {
  // TODO: Save is abit tricky...we need to form whole 218 bytes with correct effect states and etc ...then send that to device
  return `58 70 7E 02 00 00 ${hexIndex(index)} 00 00 00 00 00`;
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
  PRESET_CHANGED: [0xc0],
  EFFECT_CHANGED: [0xb0],
};

export {
  CURRENT_PRESET_DATA_COMMAND,
  SAVE_CURRENT_PRESET_DATA_COMMAND,
  SysExRequest,
  SysExResponsePattern,
};
