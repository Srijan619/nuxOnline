function extractPresetName(nameBytes: Uint8Array) {
  let name = "";
  let counter = 0;

  while (counter < nameBytes.length) {
    // If the first byte is zero, break the loop (equivalent to Dart check)
    if (nameBytes[counter] === 0) {
      break;
    }

    // Add the first character
    const char = String.fromCharCode(nameBytes[counter]);
    name += char;

    // Calculate the second character from the third byte
    let secondChar = nameBytes[counter + 2] / 2;

    // Apply the rule for second character based on the second byte
    if (nameBytes[counter + 1] === 1) {
      secondChar += 0x40;
    }

    // If the second character is non-zero, add it to the name
    if (secondChar !== 0) {
      name += String.fromCharCode(secondChar);
    } else {
      break;
    }

    // Move to the next 3-byte segment
    counter += 3;
  }

  // Trim any trailing null characters (byte value 0)
  name = name.replace(/\0+$/, "").trim();
  // Remove any non-alphanumeric characters (except space and dash)
  name = name.replace(/[^a-zA-Z0-9\s\-]/g, "");

  return name;
}

export { extractPresetName };
