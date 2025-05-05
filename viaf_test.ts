//
// Test our VIAF ID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeVIAF, validateVIAF } from "./viaf.ts";
import { verifyVIAF } from "./viaf_record.ts";

Deno.test("test viaf", async () => {
  const varified_ids: string[] = [
    "108127625",
    "101062721",
    "14957683",
    "117619223",
    "53323307",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizeVIAF(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized VIAF ID: ${normalized}`);
    // Validate
    assertEquals(validateVIAF(id), true);
    // Verify is via CrossRef
    const isOK: boolean = await verifyVIAF(id);
    assertEquals(isOK, true);
  }
});
