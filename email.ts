/**
 * this module provides normalization and validation of email address.
 * @module
 */
export const EMAILPattern: string = '^(?:"?([^"]*)"?\\s)?(?:<?(.+@[^>]+)>?)$';
export const reEMAIL: RegExp = new RegExp(EMAILPattern);

/**
 * normalize themail address.
 * @param email 
 * @returns 
 * 
 * @example
 * ```ts
 *  const email: string = normoralizeEMAIL('  jane.doe@example.edu ');
 *  console.log(email); // 'jane.doe@example.edu'
 * ```
 */
export function normalizeEMAIL(email: string): string {
  return email.trim().replaceAll(/\s+/g, "").trim();
}

/**
 * validates the form of the email address after normalizing it.
 * @param email 
 * @returns 
 * 
 * @example
 * ```ts
 *  const email: string = normoralizeEMAIL('  jane.doe@example.edu ');
 *  if (validateEMAIL(email) {
 *      console.log(`${email} appears to be valid`);
 *  } else {
 *      console.error(`${email} fails validation`);
 *  }
 * ```
 */
export function validateEMAIL(email: string): boolean {
  const normalized = normalizeEMAIL(email);
  return reEMAIL.test(normalized);
}
