import { SysExResponsePattern } from "../utils/NUXSysExCommands";

/**
 * Parses SysEx data and determines the corresponding request type.
 */
function parseSysExResponse(data: Uint8Array): string | null {
  for (const [requestType, expectedPattern] of Object.entries(
    SysExResponsePattern,
  )) {
    if (expectedPattern.every((byte, index) => data[index] === byte)) {
      return requestType;
    }
  }
  return null;
}

export { parseSysExResponse };
