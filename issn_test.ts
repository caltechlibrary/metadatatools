//
// Test our ISSN methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeISSN, validateISSN } from "./issn.ts";
import { verifyISSN } from "./issn_record.ts";

const varified_ids: string[] = [
  "1058-6180",
  "1934-1547",
];

for (const id of varified_ids) {
  // Normalize
  const normalized = normalizeISSN(id);
  assertNotEquals(normalized, undefined);
  console.log(`Normalized ISSN: ${normalized}`);
  // Validate
  assertEquals(validateISSN(id), true);
  // Verify is via retrieving the CrossRef record and not via portal.issn.org
  const isOK: boolean = await verifyISSN(id);
  assertEquals(isOK, true);
}
