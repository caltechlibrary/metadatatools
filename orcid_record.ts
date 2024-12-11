import { verifyIdentifier } from "./utility.ts";
import { normalizeORCID, validateORCID } from "./orcid.ts";

/**
 * Verifies an ORCID using an external database, orcid.org
 * @param orcid - The identifier string to verify.
 * @returns Promise<boolean> - True if the ORCID exists, otherwise false.
 */
export async function verifyORCID(orcid: string): Promise<boolean> {
  const normalizedORCID = normalizeORCID(orcid);
  return await verifyIdentifier(
    orcid,
    `https://orcid.org/${encodeURIComponent(normalizedORCID)}`,
    validateORCID,
  );
}
