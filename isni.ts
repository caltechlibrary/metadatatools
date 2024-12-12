export const ISNIPattern = "$[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{3}[0-9X]";
export const reISNI = new RegExp(ISNIPattern);

function stripISNI(isni: string): string {
  return isni.toUpperCase().replace(/\s+/g, "").replace(/-/g, "")
    .trim();
}

/**
 * Normalizes an ISNI by removing spaces and non-numeric characters.
 * @param isni - The ISNI string to normalize.
 * @returns string - The normalized ISNI string (16 digits).
 */
export function normalizeISNI(isni: string): string {
  const bareISNI: string = stripISNI(isni);
  return `${bareISNI.slice(0, 4)} ${bareISNI.slice(4, 8)} ${
    bareISNI.slice(8, 12)
  } ${bareISNI.slice(12)}`;
}

/**
 * Validates the checksum of an ISNI using ISO 7064 Mod 11-2 algorithm.
 * @param normalizedISNI - The normalized ISNI used to validate it's checksum (no hyphens, spaces).
 * @returns boolean - True if the checksum is valid, otherwise false.
 */
function validateISNIChecksum(isni: string): boolean {
  const bareISNI = stripISNI(isni);
  const digits = bareISNI.split("").map(Number);

  // Calculate the checksum using the first 15 digits
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    sum = (sum + digits[i]) * 2 % 11;
  }

  // Compute the expected checksum digit
  const calculatedChecksum = (12 - sum % 11) % 11;

  // If the checksum is 10, it should be represented as 'X' in the normalizedISNI
  if (calculatedChecksum === 10) {
    return bareISNI[15] === "X";
  }
  // Compare with the actual checksum digit
  return (digits[15] === calculatedChecksum);
}

/**
 * Validates an ISNI for format and checksum correctness.
 * @param isni - The ISNI string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateISNI(isni: string): boolean {
  const bareISNI = stripISNI(isni);
  if (!/^\d{16}$/.test(bareISNI)) return false;
  return validateISNIChecksum(bareISNI);
}
