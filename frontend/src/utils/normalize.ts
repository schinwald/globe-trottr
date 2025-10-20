export function normalizeCountryName(inputString: string) {
  const mappings: Record<string, string> = {
    ã: "a",
    é: "e",
    í: "i",
    ô: "o",
  }

  // Iterate over each character in the input string
  return Array.from(inputString.toLowerCase())
    .map((char) => {
      // Replace the character if it exists in the mappings object
      return mappings[char] || char
    })
    .join("")
    .replace(/[-' ]/g, "")
}