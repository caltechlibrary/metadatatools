/**
 * This provides normalization and validation of RAiD (Research Activity
 * Identifier) values.
 *
 * @module metadatatools
 */

export const RAiDPrefix: string = "https://raid.org/";

// RAiDs are issued as DOIs via DataCite, so RAiDPattern/RAiDShortPattern are
// the same shape as DOIPattern/DOIShortPattern (10.<4-9 digit registrant
// code>/<suffix>) under the raid.org resolver host. See
// dev-notes/decisions_RAiD_support.md D8.
export const RAiDPattern: string =
  "^https:\\/\\/raid\\.org\\/10\\.\\d{4,9}\\/[^\\s]+$";
export const reRAiD: RegExp = new RegExp(RAiDPattern);
export const RAiDShortPattern: string = "^10\\.\\d{4,9}\\/[^\\s]+$";
export const reRAiDShort: RegExp = new RegExp(RAiDShortPattern);

/**
 * Normalizes a RAiD to its short form by removing extraneous characters and
 * enforcing lowercase.
 * @param raid - The RAiD string to normalize.
 * @returns string - The normalized short-form RAiD string.
 *
 * @example
 * ```ts
 * const raid:string = normalizeRAiDShort('https://raid.org/10.26259/0e59e9a5');
 *
 * console.log(`This is the normalized ${raid}`); // 10.26259/0e59e9a5
 * ```
 */
export function normalizeRAiDShort(raid: string): string {
  const lowercaseRAiD = raid.toLowerCase().trim();
  if (URL.canParse(lowercaseRAiD)) {
    const u = URL.parse(lowercaseRAiD);
    if (
      u !== undefined && u !== null && u.pathname !== null && u.pathname !== ""
    ) {
      return u.pathname.replace(/^\//, "");
    }
  }
  return lowercaseRAiD;
}

/**
 * Normalizes a RAiD to its extended (full URL) form.
 * @param raid - The RAiD string to normalize.
 * @returns string - The normalized extended-form RAiD string.
 *
 * @example
 * ```ts
 * const raid:string = normalizeRAiD('10.26259/0e59e9a5');
 *
 * console.log(`This is the normalized ${raid}`); // https://raid.org/10.26259/0e59e9a5
 * ```
 */
export function normalizeRAiD(raid: string): string {
  return `${RAiDPrefix}${normalizeRAiDShort(raid)}`;
}

/**
 * Validates the extended (full URL) form of a RAiD.
 * @param raid - The RAiD string to validate.
 * @returns boolean - True if the RAiD is valid, otherwise false.
 *
 * @example
 * ```ts
 * const raid:string = 'https://raid.org/10.26259/0e59e9a5';
 *
 * if (validateRAiD(raid)) {
 *   console.log(`${raid} appears valid`);
 * } else {
 *   console.error(`${raid} is not valid`);
 * }
 * ```
 */
export function validateRAiD(raid: string): boolean {
  return reRAiD.test(normalizeRAiD(raid));
}

/**
 * Validates the short (bare) form of a RAiD.
 * @param raid - The RAiD string to validate.
 * @returns boolean - True if the RAiD is valid, otherwise false.
 */
export function validateRAiDShort(raid: string): boolean {
  return reRAiDShort.test(normalizeRAiDShort(raid));
}
