import { verifyIdentifier } from "./utility.ts";
import { normalizePMID, validatePMID } from "./pmid.ts";

/**
 * Verifies an PMID using an external database, pmid.org
 * @param pmid - The identifier string to verify.
 * @returns Promise<boolean> - True if the PMID exists, otherwise false.
 */
export async function verifyPMID(pmid: string): Promise<boolean> {
  const normalizedID = normalizePMID(pmid);
  return await verifyIdentifier(
    pmid,
    `https://pubmed.ncbi.nlm.nih.gov/${normalizedID}/`,
    validatePMID,
  );
}
