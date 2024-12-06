import { verifyIdentifier } from "./utility.ts";
import { normalizeISSN, validateISSN } from "./issn.ts";

/**
 * Verifies an ISSN using portal.issn.org database.
 * @param issn - The identifier string to verify.
 * @returns Promise<boolean> - True if the ISSN exists, otherwise false.
 */
export async function verifyISSN(issn: string): Promise<boolean> {
  const normalizedISSN = normalizeISSN(issn);
  return await verifyIdentifier(
    issn,
    `https://portal.issn.org/resource/ISSN/${
      encodeURIComponent(normalizedISSN)
    }`,
    validateISSN,
  );
}
