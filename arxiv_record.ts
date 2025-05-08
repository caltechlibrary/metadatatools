/**
 * This module provides the verification function for ArViX identifiers. This connects 
 * to https://export.arxiv.org API's to query for the item.
 * 
 * @module metadatatools
 */

import { verifyIdentifier } from "./utility.ts";
import { normalizeArXivID, validateArXivID } from "./arxiv.ts";

/**
 * Verifies an arXiv using an external database, arxiv.org
 * @param arxiv - The identifier string to verify.
 * @returns Promise<boolean> - True if the arXiv exists, otherwise false.
 * 
 * ```ts
 * const arxiv: string = 'arXiv:2412.03631';
 * 
 * if (await varifyArXivID(arvix)) {
 *    console.log(`${arvix} has been verified`);
 * } else {
 *    console.error(`${arvix} failed to been verified`); * 
 * }
 * ```
 */
export async function verifyArXivID(arxiv: string): Promise<boolean> {
  const normalizedID = normalizeArXivID(arxiv);
  return await verifyIdentifier(
    arxiv,
    `https://export.arxiv.org/api/query?id_list=${
      normalizedID.replace(/^arxiv:/i, "").trim()
    }`,
    validateArXivID,
  );
}
