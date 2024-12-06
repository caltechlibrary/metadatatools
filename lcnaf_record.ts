import { verifyIdentifier } from "./utility.ts";
import { normalizeLCNAF, validateLCNAF } from "./lcnaf.ts";

/**
 * Verifies an LCNAF ID using an CrossRef's API. Identifiers are normalized before
 * verifying.
 * @param id, the LCNAF identifier
 * @returns Promise<boolean> - True if the LCNAF ID exists, otherwise false.
 */
export async function verifyLCNAF(id: string): Promise<boolean> {
  const normalizedID = normalizeLCNAF(id);
  return await verifyIdentifier(
    id,
    `https://id.loc.gov/authorities/names/${normalizedID}.json`,
    validateLCNAF,
  );
}
