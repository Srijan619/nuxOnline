const SysExMockResponse: Record<number, { basic: string; detail: string }> = {
  0: {
    basic: "F0 43 58 70 15 02 00 00 64 00 00 00 00 00 F7",
    detail:
      "F0 43 58 70 0B 02 00 01 02 43 01 0A 02 01 02 01 01 02 42 00 04 14 01 02 01 00 00 32 02 00 04 00 68 25 00 4E 46 00 06 00 01 24 55 00 00 00 00 00 07 00 50 61 00 10 23 00 40 24 00 7E 4C 00 0E 3F 00 64 20 00 64 31 00 5E 32 00 64 32 00 64 32 00 64 02 00 28 32 00 00 00 00 08 3B 00 7E 24 03 2C 00 00 00 04 00 28 28 00 4F 55 00 00 00 00 00 00 00 08 4D 00 76 55 00 5A 06 00 00 00 00 64 00 01 48 00 00 04 32 00 64 02 00 00 64 00 64 00 00 00 62 00 00 00 00 02 05 00 04 03 00 12 04 00 14 06 00 0E 08 00 16 41 01 04 43 01 08 31 00 64 33 00 68 5B 01 38 5D 01 3C 61 01 44 63 01 48 0A 00 10 09 00 02 05 00 00 64 00 00 64 00 00 00 01 20 00 00 50 0B 00 78 0A 00 00 00 F7",
  },
  1: {
    basic: "F0 43 58 70 15 02 01 00 64 03 00 00 00 00 F7",
    detail:
      "F0 43 58 70 0B 02 01 00 0A 0F 01 26 02 01 02 01 01 02 08 00 04 14 01 02 01 00 00 32 02 00 04 00 68 25 00 4E 46 00 06 00 01 24 55 00 00 00 00 00 07 00 50 61 00 10 23 00 40 24 00 7E 4C 00 0E 3F 00 64 20 00 64 31 00 5E 32 00 64 32 00 64 32 00 64 02 00 28 32 00 00 00 00 08 3B 00 7E 24 03 2C 00 00 00 04 00 28 28 00 4F 55 00 00 00 00 00 00 00 08 4D 00 76 55 00 5A 06 00 00 00 00 64 00 01 48 00 00 04 32 00 64 02 00 00 64 00 64 00 00 00 62 00 00 00 00 02 05 00 04 03 00 12 04 00 14 06 00 0E 08 00 16 41 01 04 43 01 08 31 00 64 33 00 68 5B 01 38 5D 01 3C 61 01 44 63 01 48 0A 00 10 09 00 02 05 00 00 64 00 00 64 00 00 00 01 20 00 00 50 0B 00 78 0A 00 00 00 F7",
  },
  2: {
    basic: "F0 43 58 70 15 02 02 00 64 03 00 00 00 00 F7",
    detail:
      "F0 43 58 70 0B 02 02 00 0A 06 01 26 02 01 02 01 01 02 04 00 04 14 01 02 01 00 00 32 02 00 04 00 68 25 00 4E 46 00 06 00 01 24 55 00 00 00 00 00 07 00 50 61 00 10 23 00 40 24 00 7E 4C 00 0E 3F 00 64 20 00 64 31 00 5E 32 00 64 32 00 64 32 00 64 02 00 28 32 00 00 00 00 08 3B 00 7E 24 03 2C 00 00 00 04 00 28 28 00 4F 55 00 00 00 00 00 00 00 08 4D 00 76 55 00 5A 06 00 00 00 00 64 00 01 48 00 00 04 32 00 64 02 00 00 64 00 64 00 00 00 62 00 00 00 00 02 05 00 04 03 00 12 04 00 14 06 00 0E 08 00 16 41 01 04 43 01 08 31 00 64 33 00 68 5B 01 38 5D 01 3C 61 01 44 63 01 48 0A 00 10 09 00 02 05 00 00 64 00 00 64 00 00 00 01 20 00 00 50 0B 00 78 0A 00 00 00 F7",
  },
};

const mockEffects = {
  wah: {
    id: "wah_2",
    title: "Auto Wah",
    onByte: "0x01",
    offByte: "0x00",
    category: "wah",
    active: true,
  },
  comp: {
    id: "cmp_1",
    title: "Compressor",
    onByte: "0x01",
    offByte: "0x00",
    category: "comp",
    active: true,
  },
  efx: {
    id: "efx_3",
    title: "Fuzz",
    onByte: "0x01",
    offByte: "0x00",
    category: "efx",
    active: false,
  },
  amp: {
    id: "amp_5",
    title: "Mesa Boogie",
    onByte: "0x01",
    offByte: "0x00",
    category: "amp",
    active: true,
  },
  eq: {
    id: "eq_2",
    title: "Graphic EQ",
    onByte: "0x01",
    offByte: "0x00",
    category: "eq",
    active: true,
  },
  gate: {
    id: "gate_0",
    title: "Noise Gate",
    onByte: "0x01",
    offByte: "0x00",
    category: "gate",
    active: false,
  },
  mod: {
    id: "mod_4",
    title: "Phaser",
    onByte: "0x01",
    offByte: "0x00",
    category: "mod",
    active: true,
  },
  delay: {
    id: "delay_2",
    title: "Tape Echo",
    onByte: "0x01",
    offByte: "0x00",
    category: "delay",
    active: true,
  },
  reverb: {
    id: "reverb_3",
    title: "Plate",
    onByte: "0x01",
    offByte: "0x00",
    category: "reverb",
    active: true,
  },
  ir: {
    id: "ir_1",
    title: "Custom IR",
    onByte: "0x01",
    offByte: "0x00",
    category: "ir",
    active: true,
  },
  sr: {
    id: "sr_0",
    title: "Send/Return Off",
    onByte: "0x01",
    offByte: "0x00",
    category: "sr",
    active: false,
  },
  vol: {
    id: "vol_1",
    title: "Volume Pedal",
    onByte: "0x01",
    offByte: "0x00",
    category: "vol",
    active: true,
  },
};

// Example usage in PresetMockResponse
const PresetMockResponse = {
  presetNumber: 42,
  tempo: 104,
  parallel: 1,
  effectOrder: Uint8Array.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11,
  ]),
  name: "Rock Jam",
  scene: {
    scene1: Uint8Array.from([0x01, 0x40, 0x00]),
    scene2: Uint8Array.from([0x00, 0x30, 0x00]),
    scene3: Uint8Array.from([0x00, 0x20, 0x00]),
  },
  effects: mockEffects,
};

export { SysExMockResponse, PresetMockResponse };
