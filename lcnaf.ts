export const LCNAFPattern: string = "^[a-zA-Z0-9]+$"; // Example pattern for LCNAF IDs
export const reLCNAF: RegExp = new RegExp(LCNAFPattern);

/**
 * normalizeLCNAF
 * @param id, a string holding the LCNAF identifier
 * @returns normalized LCNAF identifier as a string.
 */
export function normalizeLCNAF(id: string): string {
  return id.trim();
}

/**
 * validateLCNAF
 * @param id, a string holding the LCNAF identifier
 * @returns true if valid, false otherwise
 */
export function validateLCNAF(id: string): boolean {
  const normalizedId = normalizeLCNAF(id);
  return reLCNAF.test(normalizedId);
}
