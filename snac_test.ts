//
// Test our SNAC ID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeSNAC, validateSNAC } from "./snac.ts";
import { verifySNAC } from "./snac_record.ts";

Deno.test("test snac", async () => {
  const varified_ids: string[] = [
    "108127625",
    "101062721",
    "14957683",
    "117619223",
    "53323307",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizeSNAC(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized SNAC ID: ${normalized}`);
    // Validate
    assertEquals(validateSNAC(id), true);
    // Verify is via CrossRef
    const isOK: boolean = await verifySNAC(id);
    assertEquals(isOK, true);
  }
});
