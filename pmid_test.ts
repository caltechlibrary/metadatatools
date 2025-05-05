//
// Test our PMID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizePMID, validatePMID } from "./pmid.ts";
import { verifyPMID } from "./pmid_record.ts";

Deno.test("test pmid", async () => {
  const varified_ids: string[] = [
    "34125777",
    "PMID: 25591183",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizePMID(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized PMID: ${normalized}`);
    // Validate
    assertEquals(validatePMID(id), true);
    // Verify is via pmid.org
    const isOK: boolean = await verifyPMID(id);
    assertEquals(isOK, true);
  }
});
