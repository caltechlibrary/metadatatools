const fundRefPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

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
  return fundRefPattern.test(normalizedID);
}
