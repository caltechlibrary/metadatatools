/**
 * Normalizes an ISNI by removing spaces and non-numeric characters.
 * @param isni - The ISNI string to normalize.
 * @returns string - The normalized ISNI string (16 digits).
 */
export function normalizeISNI(isni: string): string {
  return isni.replace(/\D/g, "");
}

/**
 * Validates the checksum of an ISNI using ISO 7064 Mod 11-2 algorithm.
 * @param normalizedISNI - The normalized ISNI used to validate it's checksum (no hyphens, spaces).
 * @returns boolean - True if the checksum is valid, otherwise false.
 */
export function validateISNIChecksum(normalizedISNI: string): boolean {
  const digits = normalizedISNI.split("").map(Number);

  // Calculate the checksum using the first 15 digits
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    sum = (sum + digits[i]) * 2 % 11;
  }

  // Compute the expected checksum digit
  const calculatedChecksum = (12 - sum % 11) % 11;

  // If the checksum is 10, it should be represented as 'X' in the normalizedISNI
  if (calculatedChecksum === 10) {
    return normalizedISNI[15] === 'X';    
  }
  // Compare with the actual checksum digit
  return digits[15] === calculatedChecksum;
}

/**
 * Validates an ISNI for format and checksum correctness.
 * @param isni - The ISNI string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateISNI(isni: string): boolean {
  const normalizedISNI = normalizeISNI(isni);
  if (!/^\d{16}$/.test(normalizedISNI)) return false;
  return validateISNIChecksum(normalizedISNI);
}
