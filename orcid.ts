export const ORCIDPattern: string = "^(\\d{4}-\\d{4}-\\d{4}-\\d{3}[\\dX])$";
export const reORCID: RegExp = new RegExp(ORCIDPattern);

function stripORCID(orcid: string): string {
  return orcid.toUpperCase().replace(/\s+/g, "").replace(/-/g, "")
    .trim();
}

/**
 * Normalizes the given ORCID by removing extra spaces and formatting with hyphens.
 * @param orcid - The ORCID to normalize.
 * @returns string - The normalized ORCID or the supplied string if it can't normalize.
 */
export function normalizeORCID(orcid: string): string {
  let bareORCID = stripORCID(orcid);
  if (URL.canParse(bareORCID)) {
    const u = URL.parse(bareORCID);
    if (
      u !== undefined && u !== null && u.pathname !== null && u.pathname !== ""
    ) {
      bareORCID = u.pathname.replace(/^\//, "");
    }
  }
  return `${bareORCID.slice(0, 4)}-${bareORCID.slice(4, 8)}-${
    bareORCID.slice(8, 12)
  }-${bareORCID.slice(12)}`;
}

/**
 * Validates if the given ORCID matches the format.
 * @param orcid - The ORCID to validate.
 * @returns boolean - `true` if the ORCID matches the format, otherwise `false`.
 */
export function validateORCID(orcid: string): boolean {
  const normalizedORCID = normalizeORCID(orcid);
  if (!reORCID.test(normalizedORCID)) {
    return false;
  }
  // Remove hyphens for processing
  const bareORCID = stripORCID(normalizedORCID);
  if (bareORCID.length !== 16) {
    return false;
  }
  const baseDigits = bareORCID.slice(0, 15);
  const checksumChar = bareORCID[15];
  const checksum = checksumChar === "X" ? 10 : parseInt(checksumChar, 10);

  let total = 0;
  for (const digit of baseDigits) {
    total = (total + parseInt(digit, 10)) * 2;
  }
  const calculatedChecksum = (12 - (total % 11)) % 11;
  return calculatedChecksum === checksum;
}
