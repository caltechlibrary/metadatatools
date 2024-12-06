import { verifyIdentifier } from "./utility.ts";
import { normalizeVIAF, validateVIAF } from "./viaf.ts";

/**
 * Verifies an VIAF ID using an CrossRef's API. Identifiers are normalized before
 * verifying.
 * @param id, the VIAF identifier
 * @returns Promise<boolean> - True if the VIAF ID exists, otherwise false.
 */
export async function verifyVIAF(id: string): Promise<boolean> {
  const normalizedID = normalizeVIAF(id);
  return await verifyIdentifier(
    id,
    `https://viaf.org/viaf/${normalizedID}`,
    validateVIAF,
  );
}
