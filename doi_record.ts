/**
 * This provides verification of the DOI via doi.org and retrieval the DOI object.
 *
 * @module metadatatools
 */

//
// DOI verify will contact either CrossRef or DataCite to verify the DOI
//
import { getObject, verifyIdentifier } from "./utility.ts";
import { normalizeDOIShort, validateDOI } from "./doi.ts";

/**
 * Verifies an DOI handle exists registered via the DOI API.
 * @param DOI - the identifier to verify.
 * @returns Promise<boolean> - True if exists, false otherwise.
 *
 * @example
 * ```ts
 * const doi:string = '10.22002/bv2pv-2b295';
 *
 * if (await verifyDOI(doi)) {
 *   console.log(`${doi} appears valid`);
 * } else {
 *   console.error(`${doi} is not valid`);
 * }
 * ```
 */
export async function verifyDOI(doi: string): Promise<boolean> {
  const shortDOI = normalizeDOIShort(doi);
  const verified: boolean = await verifyIdentifier(
    doi,
    `https://doi.org/api/handles/${encodeURIComponent(shortDOI)}`,
    validateDOI,
  );
  return verified;
}

/**
 * getObjectDOI retrieves an DOI record from CrossRef or DataCite
 * @param DOI - The identifier of the object to retrieve.
 * @returns Promie<object | undefined>, if retrieval fails or JSON parse fail undefined is returned.
 *
 * @example
 * ```ts
 * const doi:string = '10.22002/bv2pv-2b295';
 * const obj: {[key: string]:any} = getObjectDOI(doi);
 *
 * if (obj === undefined) {
 *   console.error(`${doi} did now return an object, maybe it is not valid`);
 * } else {
 *   console.log(`${doi} returns an object ${obj}`);
 * }
 * ```
 */
export async function getObjectDOI(doi: string): Promise<object | undefined> {
  const shortDOI = normalizeDOIShort(doi);
  const obj = await getObject(
    doi,
    `https://api.crossref.org/works/${encodeURIComponent(shortDOI)}`,
    validateDOI,
  );
  if (obj === undefined) {
    // Now try DataCite
    return await getObject(
      doi,
      `https://api.datacite.org/dois/${encodeURIComponent(shortDOI)}`,
      validateDOI,
    );
  }
  return obj;
}
