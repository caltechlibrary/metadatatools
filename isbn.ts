/**
 * Validates an ISBN-10.
 * @param isbn - The ISBN-10 string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
function validateISBN10(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9X]/gi, "");
  if (cleanISBN.length !== 10) return false;

  const checksum = cleanISBN
    .split("")
    .slice(0, 9)
    .reduce((sum, char, index) => sum + (parseInt(char) * (10 - index)), 0);

  const checkDigit = cleanISBN[9].toUpperCase() === "X"
    ? 10
    : parseInt(cleanISBN[9]);
  return (checksum + checkDigit) % 11 === 0;
}

/**
 * Validates an ISBN-13.
 * @param isbn - The ISBN-13 string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
function validateISBN13(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9]/g, "");
  if (cleanISBN.length !== 13) return false;

  const checksum = cleanISBN
    .split("")
    .reduce(
      (sum, char, index) => sum + parseInt(char) * (index % 2 === 0 ? 1 : 3),
      0,
    );

  return checksum % 10 === 0;
}

/**
 * Validates an ISBN (either ISBN-10 or ISBN-13).
 * @param isbn - The ISBN string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
export function validateISBN(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9X]/gi, "");
  if (cleanISBN.length === 10) return validateISBN10(cleanISBN);
  if (cleanISBN.length === 13) return validateISBN13(cleanISBN);
  return false;
}

/**
 * Normalizes an ISBN by removing hyphens and spaces.
 * @param isbn - The ISBN string to normalize.
 * @returns string - The normalized ISBN string.
 */
export function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, "").trim();
}
