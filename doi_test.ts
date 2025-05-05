//
// DOI tests
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeDOI, validateDOI } from "./doi.ts";
import { getObjectDOI, verifyDOI } from "./doi_record.ts";

Deno.test("test doi", async () => {
  const verified_ids: string[] = [
    //"10.1000/xyz123",
    "10.22002/bv2pv-2b295",
    "https://doi.org/10.22002/1gffr-va537",
    "https://doi.org/10.22002/0c391-eeh07",
  ];

  for (const id of verified_ids) {
    // Normalize
    const normalized = normalizeDOI(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized DOI: ${normalized}`);
    // Validate
    assertEquals(validateDOI(id), true);
    // Verify
    const isOK: boolean = await verifyDOI(id);
    assertEquals(isOK, true, `expected true, got false for DOI ${id}`);
    const obj: object | undefined = await getObjectDOI(id);
    assertNotEquals(obj, undefined);
  }
});
