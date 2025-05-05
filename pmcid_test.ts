//
// Test our PMCID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizePMCID, validatePMCID } from "./pmcid.ts";
import { verifyPMCID } from "./pmcid_record.ts";

Deno.test("test pmcid", async () => {
  const varified_ids: string[] = [
    "PMC11021482",
    "10557066",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizePMCID(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized PMCID: ${normalized}`);
    // Validate
    assertEquals(validatePMCID(id), true);
    // Verify is via pmcid.org
    const isOK: boolean = await verifyPMCID(id);
    assertEquals(isOK, true);
  }
});
