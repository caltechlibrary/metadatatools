/**
 * normalizeEAN will take a string holding an ean and normalize it.
 * @param ean, the string to be normalized
 * @returns a string
 */
export function normalizeEAN(ean: string): string {
    return ean.trim().replace(/[^0-9]/g, "");
};

/**
 * validateEAN13 validates a 13 digit EAN.
 * @param ean, the string to be validated
 * @returns true if valid, false otherwise
 */
function validateEAN13(ean: string): boolean {
    const digits = normalizeEAN(ean).split("").map(Number);
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (total % 10)) % 10;
    return checkDigit === digits[12];
}

/**
 * validateEAN8 validates a 8 digit EAN.
 * @param ean, the string to be validated
 * @returns true if valid, false otherwise
 */
function validateEAN8(ean: string): boolean {
    const digits = normalizeEAN(ean).split("").map(Number);
    let total = 0;
    for (let i = 0; i < 7; i++) {
      total += digits[i] * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (total % 10)) % 10;
    return checkDigit === digits[7];
}

/**
 * validateEAN validates an EAN (International Article Number, European Article Number, Japanese Article Number).
 * @param ean, the string to be validated
 * @returns true if valid, false otherwise
 */
export function validateEAN(ean: string): boolean {
    const normalizedEAN = normalizeEAN(ean);
    if (normalizedEAN.length === 13) {
      return validateEAN13(normalizedEAN);
    } else if (normalizedEAN.length === 8) {
      return validateEAN8(normalizedEAN);
    }
    return false;
};
  