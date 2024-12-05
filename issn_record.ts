import { getObject, verifyIdentifier } from "./utility.ts";
import { normalizeISSN, validateISSN } from "./issn.ts";

/**
 * Verifies an ISSN using an external database, the CrossRef API (not the ISSN Portal).
 * @param issn - The identifier string to verify.
 * @returns Promise<boolean> - True if the ISSN exists, otherwise false.
 */
export async function verifyISSN(issn: string): Promise<boolean> {
  const normalizedISSN = normalizeISSN(issn);
  return await verifyIdentifier(
    issn,
    `https://api.crossref.org/journals/${encodeURIComponent(normalizedISSN)}`,
    validateISSN
  );
}

/**
 * getObjectISSN retrieves a record using ISSN Portal.
 * @param issn - The identifier string of object to retreive.
 * @returns Promise<object | undefined>, if object can't be retrieved or JSON fails to parse undefined is returned.
 */
export async function getObjectISSN(issn: string): Promise<object | undefined> {
  const normalizedISSN = normalizeISSN(issn);
  return await getObject(
    issn,
    `https://api.crossref.org/journals/${encodeURIComponent(normalizedISSN)}`,
    validateISSN
  );
}
