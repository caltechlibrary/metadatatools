import { verifyIdentifier } from "./utility.ts";
import { normalizePMCID, validatePMCID } from "./pmcid.ts";

/**
 * Verifies an PMCID using an external database, pmcid.org
 * @param pmcid - The identifier string to verify.
 * @returns Promise<boolean> - True if the PMCID exists, otherwise false.
 */
export async function verifyPMCID(pmcid: string): Promise<boolean> {
  const normalizedID = normalizePMCID(pmcid);
  return await verifyIdentifier(
    pmcid,
    `https://www.ncbi.nlm.nih.gov/pmc/articles/${normalizedID}/`,
    validatePMCID,
  );
}
