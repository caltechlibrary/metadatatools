/**
 * this module provides normalization and validation of FundRefID from CrossRef
 * @module
 */
const fundRefPattern = "^10\\.\\d{4,9}\\/[-._;()/:A-Z0-9]+$";
const reFundRef = new RegExp(fundRefPattern, "i");

/**
 * normalizeFundRefID
 * @param id, FundRef identifier
 * @returns string
 * 
 * @example
 * ```ts
 * const fundRefID:string = nomralizeFundRefID('10.13039/100000001');
 * console.log(fundRefID); // 10.13039/100000001
 * ```
 */
export function normalizeFundRefID(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * validateFundRefID
 * @param id, FundRef identifier
 * @returns true if valid, false otherwise
 * 
 * @example
 * ```ts
 * const fundRefID:string = nomralizeFundRefID('10.13039/100000001');
 * 
 * if (await validateFundRefID(fundRefID)) {
 *     console.log(`{fundRefID} appears valid`);
 * } else {
 *     console.error(`{fundRefID}, failed validation`);
 * }
 * ```
 */
export function validateFundRefID(id: string): boolean {
  const normalizedID = normalizeFundRefID(id);
  return reFundRef.test(normalizedID);
}
