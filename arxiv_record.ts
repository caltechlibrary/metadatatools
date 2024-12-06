import { verifyIdentifier } from "./utility.ts";
import { normalizeArXivID, validateArXivID } from "./arxiv.ts";

/**
 * Verifies an arXiv using an external database, arxiv.org
 * @param arxiv - The identifier string to verify.
 * @returns Promise<boolean> - True if the arXiv exists, otherwise false.
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
