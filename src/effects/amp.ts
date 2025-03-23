type KnobEntry = [string, string, [number, number]?];

// Type for the output knob object
interface Knob {
  id: string;
  title: string;
  range: [number, number];
  ctrl: number;
}

// Type for the full output
interface KnobsConfig {
  knobs: Knob[];
}

const populateKnobs = (
  customKnobs: KnobEntry[] = PRIMARY_VARIANT,
): KnobsConfig => {
  const knobData = customKnobs;

  return {
    knobs: knobData.map(([id, title, range], index) => ({
      id,
      title,
      range: range || [0, 100],
      ctrl: 24 + index,
    })),
  };
};

const PRIMARY_VARIANT: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["treble", "TREBLE"],
  ["presence", "PRESENCE"],
  ["bias", "BIAS LEVEL"],
  ["level", "LEVEL"],
];

const PRIMARY_BRIGHT_VARIANT: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["treble", "TREBLE"],
  ["bright", "BRIGHT", [0, 1]],
  ["bias", "BIAS LEVEL"],
  ["level", "LEVEL"],
];

const AGL_VARIANT: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["mfreq", "M. FREQUENCY"],
  ["treble", "TREBLE"],
  ["level", "LEVEL"],
];

const PRIMARY_VARIANT_WITHOUT_BIAS: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["treble", "TREBLE"],
  ["presence", "PRESENCE"],
  ["level", "LEVEL"],
];

const SECOND_VARIANT: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["cut", "CUT"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["treble", "TREBLE"],
  ["level", "LEVEL"],
];

const SECOND_VARIANT_WITHOUT_MIDDLE: KnobEntry[] = [
  ["gain", "GAIN"],
  ["master", "MASTER"],
  ["cut", "CUT"],
  ["bass", "BASS"],
  ["middle", "MIDDLE"],
  ["treble", "TREBLE"],
  ["level", "LEVEL"],
];

const DGLASS_VARIANT: KnobEntry[] = [
  ["master", "MASTER"],
  ["bass", "BASS"],
  ["1hz", "Hertz 1", [0, 2]],
  ["lomids", "LO MIDS"],
  ["himids", "HI MIDS"],
  ["2hz", "Hertz 2", [0, 2]],
  ["treble", "TREBLE"],
  ["level", "LEVEL"],
];

const STARLIFT_VARIANT: KnobEntry[] = [
  ["bass", "BASS"],
  ["mid", "MID"],
  ["midfreq", "MID FREQ"],
  ["treble", "TREBLE"],
  ["contour", "CONTOUR", [0, 2]],
  ["volume", "VOLUME"],
  ["level", "LEVEL"],
];

const PRINCETON_VARIANT: KnobEntry[] = [
  ["volume", "VOLUME"],
  ["treble", "TREBLE"],
  ["bass", "BASS"],
  ["bias", "BIAS LEVEL"],
  ["level", "LEVEL"],
];

const TWEEDY_VARIANT: KnobEntry[] = [
  ["gain", "GAIN"],
  ["tone", "TONE"],
  ["master", "MASTER"],
  ["level", "LEVEL"],
];

export default {
  amp: {
    knobControlStart: [24, 25, 26, 27, 28, 29, 30, 31],
    category: "🎚️ Amp",
    options: [
      {
        id: "JAZZ_CLEAN",
        title: "Jazz Clean",
        onByte: "01",
        offByte: "65",
        dominantColor: "#90A4AE",
        ...populateKnobs(PRIMARY_BRIGHT_VARIANT),
      },
      {
        id: "DELUXE_RVB",
        title: "Deluxe Reverb",
        onByte: "02",
        offByte: "42",
        dominantColor: "#004D40",
        ...populateKnobs(),
      },
      {
        id: "BASSMATE",
        title: "Bassmate",
        onByte: "03",
        offByte: "43",
        dominantColor: "#FF9800",
        ...populateKnobs(),
      },
      {
        id: "TWEEDY",
        title: "Tweedy",
        onByte: "04",
        offByte: "44",
        dominantColor: "#FFC107",
        ...populateKnobs(TWEEDY_VARIANT),
      },
      {
        id: "TWIN_RVB",
        title: "Twin Reverb",
        onByte: "05",
        offByte: "45",
        dominantColor: "#66BB6A",
        ...populateKnobs(PRIMARY_BRIGHT_VARIANT),
      },
      {
        id: "HIWIRE",
        title: "Hiwire",
        onByte: "06",
        offByte: "46",
        dominantColor: "#BDBDBD",
        ...populateKnobs(),
      },
      {
        id: "CALI_CRUNCH",
        title: "Cali Crunch",
        onByte: "07",
        offByte: "47",
        dominantColor: "#FFECB3",
        ...populateKnobs(),
      },
      {
        id: "CLASS_A15",
        title: "Class A15",
        onByte: "08",
        offByte: "48",
        dominantColor: "#BCAAA4",
        ...populateKnobs(SECOND_VARIANT_WITHOUT_MIDDLE),
      },
      {
        id: "CLASS_A30",
        title: "Class A30",
        onByte: "09",
        offByte: "49",
        dominantColor: "#E91E63",
        ...populateKnobs(SECOND_VARIANT_WITHOUT_MIDDLE),
      },
      {
        id: "PLEXI_100",
        title: "Plexi 100",
        onByte: "0A",
        offByte: "4A",
        dominantColor: "#FFA726",
        ...populateKnobs(),
      },
      {
        id: "PLEXI_45",
        title: "Plexi 45",
        onByte: "0B",
        offByte: "4B",
        dominantColor: "#FFCA28",
        ...populateKnobs(),
      },
      {
        id: "BRIT_800",
        title: "Brit 800",
        onByte: "0C",
        offByte: "4C",
        dominantColor: "#FFCC80",
        ...populateKnobs(),
      },
      {
        id: "1987_X_50",
        title: "1987 X 50",
        onByte: "0D",
        offByte: "4D",
        dominantColor: "#FFE0B2",
        ...populateKnobs(),
      },
      {
        id: "SLO_100",
        title: "SLO 100",
        onByte: "0E",
        offByte: "4E",
        dominantColor: "#B2DFDB",
        ...populateKnobs(),
      },
      {
        id: "FIREMAN_HBE",
        title: "Fireman HBE",
        onByte: "0F",
        offByte: "4F",
        dominantColor: "#9E9D24",
        ...populateKnobs(),
      },
      {
        id: "DUAL_RECT",
        title: "Dual Rect",
        onByte: "10",
        offByte: "50",
        dominantColor: "#000000",
        ...populateKnobs(),
      },
      {
        id: "DIE_VH4",
        title: "Die VH4",
        onByte: "11",
        offByte: "51",
        dominantColor: "#F5F5F5",
        ...populateKnobs(),
      },
      {
        id: "VIBRO_KING",
        title: "Vibro King",
        onByte: "12",
        offByte: "52",
        dominantColor: "#C6BE7E",
        ...populateKnobs(),
      },
      {
        id: "BUDDA",
        title: "Budda",
        onByte: "13",
        offByte: "53",
        dominantColor: "#CE93D8",
        ...populateKnobs(SECOND_VARIANT),
      },
      {
        id: "MR_Z_38",
        title: "Mr. Z 38",
        onByte: "14",
        offByte: "54",
        dominantColor: "#E57373",
        ...populateKnobs(SECOND_VARIANT),
      },
      {
        id: "SUPER_RVB",
        title: "Super RVB",
        onByte: "15",
        offByte: "55",
        dominantColor: "#004D40",
        ...populateKnobs(PRIMARY_BRIGHT_VARIANT),
      },
      {
        id: "BRIT_BLUES",
        title: "Brit Blues",
        onByte: "16",
        offByte: "56",
        dominantColor: "#FFE082",
        ...populateKnobs(),
      },
      {
        id: "MATCH",
        title: "Match",
        onByte: "17",
        offByte: "57",
        dominantColor: "#000000",
        ...populateKnobs(SECOND_VARIANT_WITHOUT_MIDDLE),
      },
      {
        id: "BRIT_2000",
        title: "Brit 2000",
        onByte: "18",
        offByte: "58",
        dominantColor: "#FFE060",
        ...populateKnobs(),
      },
      {
        id: "UBER",
        title: "Uber",
        onByte: "19",
        offByte: "59",
        dominantColor: "#455A64",
        ...populateKnobs(),
      },
      {
        id: "AGL",
        title: "AGL",
        onByte: "1A",
        offByte: "5A",
        dominantColor: "#BDBDBD",
        ...populateKnobs(AGL_VARIANT),
      },
      {
        id: "BASSGUY",
        title: "Bassguy",
        onByte: "1B",
        offByte: "5B",
        dominantColor: "#CFD8DC",
        ...populateKnobs(PRIMARY_VARIANT_WITHOUT_BIAS),
      },
      {
        id: "MLD",
        title: "MLD",
        onByte: "1C",
        offByte: "5C",
        dominantColor: "#1565C0",
        ...populateKnobs(PRIMARY_VARIANT_WITHOUT_BIAS),
      },
      {
        id: "OPTIMA_AIR",
        title: "Optima Air",
        onByte: "1D",
        offByte: "5D",
        dominantColor: "#FFB830",
        ...populateKnobs(PRIMARY_VARIANT_WITHOUT_BIAS),
      },
      {
        id: "STAGEMAN",
        title: "Stageman",
        onByte: "1E",
        offByte: "5E",
        dominantColor: "#FFF59D",
        ...populateKnobs(PRIMARY_VARIANT_WITHOUT_BIAS),
      },
      {
        id: "DGLASS",
        title: "Dglass",
        onByte: "1F",
        offByte: "5F",
        dominantColor: "#FFF59D",
        ...populateKnobs(DGLASS_VARIANT),
      },
      {
        id: "STARLIFT",
        title: "Starlift",
        onByte: "20",
        offByte: "60",
        dominantColor: "#42A5F5",
        ...populateKnobs(STARLIFT_VARIANT),
      },
      {
        id: "VIVO",
        title: "Vivo",
        onByte: "21",
        offByte: "61",
        dominantColor: "#EEEEEE",
        ...populateKnobs(),
      },
      {
        id: "F_PRINCETON",
        title: "F Princeton",
        onByte: "22",
        offByte: "62",
        dominantColor: "#00796B",
        ...populateKnobs(PRINCETON_VARIANT),
      },
      {
        id: "LONESTAR",
        title: "Lonestar",
        onByte: "23",
        offByte: "63",
        dominantColor: "#FFE082",
        ...populateKnobs(),
      },
    ],
  },
};
