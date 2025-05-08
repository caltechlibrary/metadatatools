/**
 * This provides normalization and validates DOI
 * 
 * @module metadatatools
 */

export const DOIPattern: string = "^10\\.\\d{4,9}\\/[^\\s]+$";
export const reDOI: RegExp = new RegExp(DOIPattern);

/**
 * Normalizes a DOI by removing extraneous characters and enforcing lowercase.
 * @param doi - The DOI string to normalize.
 * @returns string - The normalized DOI string.
 * 
 * ```ts
 * const doi:string = normalizeDOI('https://www.doi.org/10.22002/bv2pv-2b295');
 * 
 * console.log(`This is the normalized ${doi}`); // 10.22002/bv2pv-2b295
 * ```
 */
export function normalizeDOI(doi: string): string {
  const lowercaseDOI = doi.toLowerCase().trim();
  if (URL.canParse(lowercaseDOI)) {
    const u = URL.parse(lowercaseDOI);
    if (
      u !== undefined && u !== null && u.pathname !== null && u.pathname !== ""
    ) {
      return u.pathname.replace(/^\//, "");
    }
  }
  return lowercaseDOI;
}

/**
 * Validates the format of a DOI.
 * @param doi - The DOI string to validate.
 * @returns boolean - True if the DOI is valid, otherwise false.
 * 
 * ```ts
 * const doi:string = normalizeDOI('https://www.doi.org/10.22002/bv2pv-2b295');
 * 
 * if (validateDOI(doi)) {
 *   console.log(`${doi} appears valid`);
 * } else {
 *   console.error(`${doi} is not valid`);
 * }
 * ```
 */
export function validateDOI(doi: string): boolean {
  const normalizedDOI = normalizeDOI(doi);
  return reDOI.test(normalizedDOI);
}
