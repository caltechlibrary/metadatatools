//
// Test our EAN methods
//
import { assertEquals } from "@std/assert";

import { normalizeEAN, validateEAN } from "./ean.ts";

const varified_ids: string[] = [
    "9780201544282"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeEAN(id);
  console.log(`Normalized EAN: ${normalized}`);
  // Validate
  assertEquals(validateEAN(id), true);
  // NOTE: To verify the EAN you need an account on ean-search.org or other database.
  // You're best bet would be to treat the EAN as an ISBN and verify against a public resource
  // like Open Library or OCLC if you have access there.
}


