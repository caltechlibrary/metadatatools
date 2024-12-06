import { verifyIdentifier } from "./utility.ts";
import { normalizeROR, validateROR } from "./ror.ts";

/**
 * Verifies an ROR using an external database, ror.org
 * @param ror - The identifier string to verify.
 * @returns Promise<boolean> - True if the ROR exists, otherwise false.
 */
export async function verifyROR(ror: string): Promise<boolean> {
  const normalizedROR = normalizeROR(ror);
  return await verifyIdentifier(
    ror,
    normalizedROR,
    validateROR,
  );
}
