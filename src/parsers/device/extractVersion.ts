import type { DeviceVersion } from "../../types";

function extractDeviceVersion(response: Uint8Array): DeviceVersion {
  if (response.length < 6) {
    console.warn("⚠️ Unexpected SysEx response length:", response);
    return { version: "Unknown" };
  }

  const versionBytes = response.slice(4, response.length - 1); // Avoid reading out of bounds
  let version = String.fromCharCode(...versionBytes).trim();

  version = version.replace(/\0+$/, "").split("MG-30")[0].trim();

  version = version.replace(/[^a-zA-Z0-9.\-]/g, "").trim();
  console.log(`🎸 Device version: ${version}`);
  return { version: version || "Unknown" };
}

export { extractDeviceVersion };
