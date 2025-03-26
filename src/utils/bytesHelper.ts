function unitHexToBytes(response: Uint8Array): string[] {
  return Array.from(response, (byte) =>
    byte.toString(16).padStart(2, "0").toUpperCase(),
  );
}

function hexToBytes(hexString: string): Uint8Array {
  return new Uint8Array(hexString.split(" ").map((h) => parseInt(h, 16)));
}

function hexIndex(index: number) {
  return index.toString(16).padStart(2, "0").toUpperCase();
}

export { unitHexToBytes, hexToBytes, hexIndex };
