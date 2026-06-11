/**
 * This provides normalization and validates DOI
 *
 * @module metadatatools
 */

export const DOIPrefix: string = "https://doi.org/";
export const DOIPattern: string =
  "^https:\\/\\/doi\\.org\\/10\\.\\d{4,9}\\/[^\\s]+$";
export const reDOI: RegExp = new RegExp(DOIPattern);
export const DOIShortPattern: string = "^10\\.\\d{4,9}\\/[^\\s]+$";
export const reDOIShort: RegExp = new RegExp(DOIShortPattern);

/**
 * Normalizes a DOI to its short form by removing extraneous characters and
 * enforcing lowercase.
 * @param doi - The DOI string to normalize.
 * @returns string - The normalized short-form DOI string.
 *
 * @example
 * ```ts
 * const doi:string = normalizeDOIShort('https://www.doi.org/10.22002/bv2pv-2b295');
 *
 * console.log(`This is the normalized ${doi}`); // 10.22002/bv2pv-2b295
 * ```
 */
export function normalizeDOIShort(doi: string): string {
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
 * Normalizes a DOI to its extended (full URL) form.
 * @param doi - The DOI string to normalize.
 * @returns string - The normalized extended-form DOI string.
 *
 * @example
 * ```ts
 * const doi:string = normalizeDOI('10.22002/bv2pv-2b295');
 *
 * console.log(`This is the normalized ${doi}`); // https://doi.org/10.22002/bv2pv-2b295
 * ```
 */
export function normalizeDOI(doi: string): string {
  return `${DOIPrefix}${normalizeDOIShort(doi)}`;
}

/**
 * Validates the extended (full URL) form of a DOI.
 * @param doi - The DOI string to validate.
 * @returns boolean - True if the DOI is valid, otherwise false.
 *
 * @example
 * ```ts
 * const doi:string = 'https://www.doi.org/10.22002/bv2pv-2b295';
 *
 * if (validateDOI(doi)) {
 *   console.log(`${doi} appears valid`);
 * } else {
 *   console.error(`${doi} is not valid`);
 * }
 * ```
 */
export function validateDOI(doi: string): boolean {
  return reDOI.test(normalizeDOI(doi));
}

/**
 * Validates the short (bare) form of a DOI.
 * @param doi - The DOI string to validate.
 * @returns boolean - True if the DOI is valid, otherwise false.
 */
export function validateDOIShort(doi: string): boolean {
  return reDOIShort.test(normalizeDOIShort(doi));
}
