//
// DOI validate and normalize routines.
//

/**
 * Normalizes a DOI by removing extraneous characters and enforcing lowercase.
 * @param doi - The DOI string to normalize.
 * @returns string - The normalized DOI string.
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
 */
export function validateDOI(doi: string): boolean {
  const normalizedDOI = normalizeDOI(doi);
  const doiRegex = /^10\.\d{4,9}\/[^\s]+$/;
  return doiRegex.test(normalizedDOI);
}
