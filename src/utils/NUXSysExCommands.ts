import type { Nux } from "../types";
import { hexIndex } from "./bytesHelper";

const PRESET_DATA_COMMAND = (index: number) => {
  return `58 70 0B 00 ${hexIndex(index)} 00 00 00 00 00 00 00`;
};

const SAVE_CURRENT_PRESET_DATA_COMMAND = (index: number) => {
  // TODO: Save is abit tricky...we need to form whole 218 bytes with correct effect states and etc ...then send that to device
  return `58 70 7E 02 00 00 ${hexIndex(index)} 00 00 00 00 00`;
};

const CURRENT_PRESET_EFFECT_ORDER_COMMAND = (options: Nux.EffectOption[]) => {
  let command = [240, 67, 88, 112, 126, 2, 13];
  options.forEach((option) => {
    if (option.index !== undefined && option.index !== null) {
      command.push(option.index);
    }
  });
  command.push(0);
  command.push(247);
  console.log("Sending current preset effect order command", command);
  return command;
};

//TODO: Commands needs to be hooked in to mock implementation somewhere
enum SysExRequest {
  DEVICE_VERSION = "58 00",
  CURRENT_PRESET_BASIC = "58 70 15 00",
  REQUEST_UPDATED_EFFECT_ORDER_COMMAND = "58 70 0C 00",
}

const SysExResponsePattern = {
  DEVICE_VERSION: [0xf0, 0x43, 0x58, 0x10],
  CURRENT_PRESET_BASIC: [0xf0, 0x43, 0x58, 0x70, 0x15, 0x02],
  CURRENT_PRESET_DETAIL: [0xf0, 0x43, 0x58, 0x70, 0x0b, 0x02],
  UPDATED_EFFECTS_ORDER: [0xf0, 0x43, 0x58, 0x70, 0x0c, 0x02],
  PRESET_CHANGED: [0xc0],
  EFFECT_CHANGED: [0xb0],
  EFFECT_ORDER_CHANGED: [0xf0, 0x43, 0x58, 0x70, 0x7e, 0x02, 0x0d],
};

export {
  PRESET_DATA_COMMAND,
  SAVE_CURRENT_PRESET_DATA_COMMAND,
  CURRENT_PRESET_EFFECT_ORDER_COMMAND,
  SysExRequest,
  SysExResponsePattern,
};
