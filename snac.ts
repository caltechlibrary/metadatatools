export const SNACPattern = "^\\d+$"; // SNAC IDs are numeric
export const reSNAC = new RegExp(SNACPattern);

/**
 * normalizeSNAC
 * @param id, a string holding the SNAC identifier
 * @returns normalized SNAC identifier as a string.
 */
export function normalizeSNAC(id: string): string {
  return id.trim();
}

/**
 * validateSNAC
 * @param id, a string holding the SNAC identifier
 * @returns true if valid, false otherwise
 */
export function validateSNAC(id: string): boolean {
  const normalizedId = normalizeSNAC(id);
  return reSNAC.test(normalizedId);
}
