//
// Test our ISSN methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeISSN, validateISSN } from "./issn.ts";
import { verifyISSN, getObjectISSN } from "./issn_record.ts";

const varified_ids: string[] = [
  "1058-6180",
  "1934-1547"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeISSN(id);
  console.log(`Normalized ISSN: ${normalized}`);
  // Validate
  assertEquals(validateISSN(id), true);
  // Verify is via retrieving the CrossRef record and not via portal.issn.org
  let isOK: boolean = await verifyISSN(id);
  assertEquals(isOK, true);
  // getObject is handle via CrossRef lookup
  let obj: object | undefined = await getObjectISSN(id);
  assertNotEquals(obj, undefined);
//  console.log(`DEBUG obj -> ${typeof obj} -> ${obj}`);
}
