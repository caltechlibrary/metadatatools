export const ISBN10Pattern = "^(?:\\d[\\ |-]?){9}[\\d|X]$";
export const reISBN10 = new RegExp(ISBN10Pattern, "i");
export const ISBN13Pattern = "^(?:\d[\ |-]?){13}$";
export const reISBN13 = new RegExp(ISBN13Pattern, "i");
export const ISBNPattern = "^((?:\\d[\\ |-]?){9}[\\d|X]|(?:\d[\ |-]?){13})$";
export const reISBN = new RegExp(ISBNPattern, "i");

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
 * normalizeISBN normalizes an ISBN by removing hyphens and spaces.
 * @param isbn - The ISBN string to normalize.
 * @returns string - The normalized ISBN string.
 */
export function normalizeISBN(isbn: string): string {
  const bareISBN = isbn.replace(/[-\s]/g, "").trim();
  if (bareISBN.length === 10) {
    return `${bareISBN.substring(0, 1)}-${bareISBN.substring(1, 4)}-${
      bareISBN.substring(4, 9)
    }-${bareISBN.substring(9)}`;
  } else if (bareISBN.length === 13) {
    return `${bareISBN.substring(0, 3)}-${bareISBN.substring(3, 4)}-${
      bareISBN.substring(4, 6)
    }-${bareISBN.substring(6, 11)}-${bareISBN.substring(11)}`;
  }
  return bareISBN;
}
