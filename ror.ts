export const rorPrefix: string = "https://ror.org/";
export const RORPattern: string =
  "^https:\\/\\/ror\\.org\\/0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$|^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$";
export const reROR: RegExp = new RegExp(RORPattern, "i");
//;

/**
 * normalizeROR takes a string and returns a normalized vesion of the ROR
 * @param ror
 * @returns string
 */
export function normalizeROR(ror: string): string {
  const bareROR = ror.trim().toLowerCase();
  if (bareROR.startsWith(rorPrefix)) {
    return bareROR;
  }
  return `${rorPrefix}${bareROR}`;
}

/**
 * validateROR takes a string and return true if it is a valid ROR and false otherwise.
 * The ROR will be normalized before validation.
 * @param ror
 * @returns true if a valid ROR, false otherwise
 */
export function validateROR(ror: string): boolean {
  const normalizedROR = normalizeROR(ror);
  return reROR.test(normalizedROR);
}
