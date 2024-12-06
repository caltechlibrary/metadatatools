import { verifyIdentifier } from "./utility.ts";
import { normalizeFundRefID, validateFundRefID } from "./fundref.ts";

/**
 * Verifies an FundRefID using an CrossRef's API. Identifiers are normalized before
 * verifying.
 * @param id, the FundRef identifier
 * @returns Promise<boolean> - True if the FundRef ID exists, otherwise false.
 */
export async function verifyFundRefID(id: string): Promise<boolean> {
  const normalizedID = normalizeFundRefID(id);
  return await verifyIdentifier(
    id,
    `https://api.crossref.org/funders/${normalizedID}`,
    validateFundRefID,
  );
}
