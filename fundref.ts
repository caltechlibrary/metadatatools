const fundRefPattern = "^10\\.\\d{4,9}\\/[-._;()/:A-Z0-9]+$";
const reFundRef = new RegExp(fundRefPattern, "i");

/**
 * normalizeFundRefID
 * @param id, FundRef identifier
 * @returns string
 */
export function normalizeFundRefID(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * validateFundRefID
 * @param id, FundRef identifier
 * @returns true if valid, false otherwise
 */
export function validateFundRefID(id: string): boolean {
  const normalizedID = normalizeFundRefID(id);
  return reFundRef.test(normalizedID);
}
