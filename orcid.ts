/**
 * Normalizes the given ORCID by removing extra spaces and formatting with hyphens.
 * @param orcid - The ORCID to normalize.
 * @returns string - The normalized ORCID or the supplied string if it can't normalize.
 */
export function normalizeORCID(orcid: string): string {
  let cleanedOrcid = orcid.toUpperCase().replace(/\s+/g, "").replace(/-/g, "")
    .trim();
  if (URL.canParse(cleanedOrcid)) {
    const u = URL.parse(cleanedOrcid);
    if (
      u !== undefined && u !== null && u.pathname !== null && u.pathname !== ""
    ) {
      cleanedOrcid = u.pathname.replace(/^\//, "");
    }
  }
  return `${cleanedOrcid.slice(0, 4)}-${cleanedOrcid.slice(4, 8)}-${
    cleanedOrcid.slice(8, 12)
  }-${cleanedOrcid.slice(12)}`;
}

/**
 * Validates if the given ORCID matches the format.
 * @param orcid - The ORCID to validate.
 * @returns boolean - `true` if the ORCID matches the format, otherwise `false`.
 */
export function validateORCID(orcid: string): boolean {
  const normalizedORCID = normalizeORCID(orcid);
  const orcidRegex = /^(\d{4}-\d{4}-\d{4}-\d{3}[\dX])$/;
  return orcidRegex.test(normalizedORCID);
}

/**
 * Verifies the checksum of the given ORCID using Mod 11-2 algorithm.
 * @param orcid - The ORCID to verify.
 * @returns boolean - `true` if the checksum is valid, otherwise `false`.
 */
export function verifyORCID(orcid: string): boolean {
  // Remove hyphens for processing
  const normalizedOrcid = orcid.replace(/-/g, "");
  if (normalizedOrcid.length !== 16) return false;

  const baseDigits = normalizedOrcid.slice(0, 15);
  const checksumChar = normalizedOrcid[15];
  const checksum = checksumChar === "X" ? 10 : parseInt(checksumChar, 10);

  let total = 0;
  for (const digit of baseDigits) {
    total = (total + parseInt(digit, 10)) * 2;
  }
  const calculatedChecksum = (12 - (total % 11)) % 11;

  return calculatedChecksum === checksum;
}
