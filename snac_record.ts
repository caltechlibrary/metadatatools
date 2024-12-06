import { verifyIdentifier } from "./utility.ts";
import { normalizeSNAC, validateSNAC } from "./snac.ts";

/**
 * Verifies an SNAC ID using an SNAC Cooperative website. Identifiers are normalized before
 * verifying.
 * @param id, the SNAC identifier
 * @returns Promise<boolean> - True if the SNAC ID exists, otherwise false.
 */
export async function verifySNAC(id: string): Promise<boolean> {
  const normalizedID = normalizeSNAC(id);
  return await verifyIdentifier(
    id,
    `https://snaccooperative.org/view/${normalizedID}`,
    validateSNAC,
  );
}
