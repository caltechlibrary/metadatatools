//
// DOI tests
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeDOI, validateDOI } from "./doi.ts";
import { getObjectDOI, verifyDOI } from "./doi_record.ts";

const verified_ids: string[] = [
  //"10.1000/xyz123",
  "10.22002/bv2pv-2b295",
  "https://doi.org/10.22002/1gffr-va537",
  "https://doi.org/10.22002/0c391-eeh07",
];

for (let id of verified_ids) {
  // Normalize
  let normalized = normalizeDOI(id);
  console.log(`Normalized DOI: ${normalized}`);
  // Validate
  assertEquals(validateDOI(id), true);
  // Verify
  let isOK: boolean = await verifyDOI(id);
  assertEquals(isOK, true);
  let obj: object | undefined = await getObjectDOI(id);
  assertNotEquals(obj, undefined);
}
