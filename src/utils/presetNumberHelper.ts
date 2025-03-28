// Function to generate the preset number format (e.g., 01A, 01B, 01C, etc.)
const formatPresetNumber = (index: number) => {
  const groupNumber = Math.floor(index / 4) + 1; // Group increments every 4 presets (A-D)
  const letter = String.fromCharCode(65 + (index % 4)); // Letters A-D
  return `${String(groupNumber).padStart(2, "0")}${letter}`;
};
export { formatPresetNumber };
