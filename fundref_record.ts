/**
 * this module provides varification of FundRefID via CrossRef.
 * @module
 */
import { verifyIdentifier } from "./utility.ts";
import { normalizeFundRefID, validateFundRefID } from "./fundref.ts";

/**
 * Verifies an FundRefID using an CrossRef's API. Identifiers are normalized before
 * verifying.
 * @param id, the FundRef identifier
 * @returns Promise<boolean> - True if the FundRef ID exists, otherwise false.
 * 
 * @example
 * ```ts
 * const fundRefID:string = nomralizeFundRefID('10.13039/100000001');
 * 
 * if (await verifyFundRefID(fundRefID)) {
 *     console.log(`{fundRefID} has been verified`);
 * } else {
 *     console.error(`{fundRefID}, failed verification`);
 * }
 * ```
 */
export async function verifyFundRefID(id: string): Promise<boolean> {
  const normalizedID = normalizeFundRefID(id);
  return await verifyIdentifier(
    id,
    `https://api.crossref.org/funders/${normalizedID}`,
    validateFundRefID,
  );
}
