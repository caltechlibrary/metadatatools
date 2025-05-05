//
// Test our ROR methods
//
import { assertEquals } from "@std/assert";

import { normalizeROR, validateROR } from "./ror.ts";
import { verifyROR } from "./ror_record.ts";


Deno.test('tests varified ROR', async function () {
  const varified_ids: string[] = [
    "https://ror.org/05dxps055",
    "https://ror.org/040ty4453",
    "https://ror.org/03taz7m60",
    "https://ror.org/05td03w87",
    "https://ror.org/024e4df17"
];

for (let id of varified_ids) {
    // Normalize
    let normalized = normalizeROR(id);
    console.log(`Normalized ROR: ${normalized}`);
    // Validate
    assertEquals(validateROR(id), true);
    // Verify is via ror.org
    let isOK: boolean = await verifyROR(id);
    assertEquals(isOK, true);
  }
  
});

Deno.test('test caltech doi', function() {
  const ror = "https://ror.org/05dxps055";
  assertEquals(validateROR(ror), true, `Caltech Library ROR should validate, ${ror}`);
})