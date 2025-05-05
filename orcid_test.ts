//
// Test our ORCID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeORCID, validateORCID } from "./orcid.ts";
import { verifyORCID } from "./orcid_record.ts";

Deno.test("test orcid", async () => {
  const varified_ids: string[] = [
    "https://orcid.org/0000-0003-0900-6903",
    "0000-0002-6539-638X",
    "0000-0001-9266-5146",
    "0000-0002-0026-2516",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizeORCID(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized ORCID: ${normalized}`);
    // Validate
    assertEquals(validateORCID(id), true);
    // Verify is via orcid.org
    const isOK: boolean = await verifyORCID(id);
    assertEquals(isOK, true);
  }
});
