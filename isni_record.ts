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
