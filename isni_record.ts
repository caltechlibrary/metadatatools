import { verifyIdentifier } from "./utility.ts";
import { normalizeISNI, validateISNI } from "./isni.ts";

/**
 * Verifies an ISNI using an external database, isni.org
 * @param isni - The identifier string to verify.
 * @returns Promise<boolean> - True if the ISNI exists, otherwise false.
 */
export async function verifyISNI(isni: string): Promise<boolean> {
  const normalizedISNI = normalizeISNI(isni);
  return await verifyIdentifier(
    isni,
    `https://isni.org/isni/${encodeURIComponent(normalizedISNI)}`,
    validateISNI,
  );
}

/**
 * getObjectISNI retrieves a record using ISNI Portal.
 * @param isni - The identifier string of object to retreive.
 * @returns Promise<object | undefined>, if object can't be retrieved or JSON fails to parse undefined is returned.
 *
 * NOTE: At this time this function always returns undefined since there isn't a public JSON API end point to use.
 */
/*
export async function getObjectISNI(isni: string): Promise<object | undefined> {
  const normalizedISNI = normalizeISNI(isni);
  return await getObject(
    isni,
    `https://isni.org/isni/${encodeURIComponent(normalizedISNI)}`,
    validateISNI,
  );
  return undefined;
}
*/
