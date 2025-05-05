export const ISSNPattern: string = "^ISSN\s+?(\d{4})-(\d{3}[\dX])$";
export const reISSN: RegExp = new RegExp(ISSNPattern, "i");

/**
 * Validates the checksum of an ISSN.
 * @param issn - The normalized ISSN string (without hyphen).
 * @returns boolean - True if valid, otherwise false.
 */
function validateISSNChecksum(issn: string): boolean {
  if (issn.length !== 8) return false;

  const digits = issn.slice(0, 7);
  const checkDigit = issn[7].toUpperCase();

  const checksum = digits
    .split("")
    .reduce((sum, char, index) => sum + parseInt(char) * (8 - index), 0) %
    11;

  const expectedCheckDigit = checksum === 0
    ? "0"
    : checksum === 1
    ? "X"
    : `${11 - checksum}`;
  return checkDigit === expectedCheckDigit;
}

function stripISSN(issn: string): string {
  return issn.toUpperCase().replaceAll(/\D|X/g, "");
}

/**
 * Validates the format and checksum of an ISSN.
 * @param issn - The ISSN string to validate.
 * @returns boolean - True if the ISSN is valid, otherwise false.
 */
export function validateISSN(issn: string): boolean {
  const bareISSN = stripISSN(issn);
  return validateISSNChecksum(bareISSN);
}

/**
 * Normalizes an ISSN by removing spaces, invalid characters, and ensuring uppercase.
 * @param issn - The ISSN string to normalize.
 * @returns string - The normalized ISSN string (without hyphen).
 */
export function normalizeISSN(issn: string): string {
  const bareISSN = stripISSN(issn);
  //console.log(`DEBUG bareISSN -> ${bareISSN}`);
  return `${bareISSN.substring(0, 4)}-${bareISSN.substring(4)}`;
}
