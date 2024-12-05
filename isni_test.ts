//
// Test our ISNI methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeISNI, validateISNI } from "./isni.ts";
import { verifyISNI } from "./isni_record.ts";

const varified_ids: string[] = [
    "0000 0001 2096 0218",
    "0000 0000 8405 6132",
    "0000 0000 7182 7209"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeISNI(id);
  console.log(`Normalized ISNI: ${normalized}`);
  // Validate
  assertEquals(validateISNI(id), true);
  // Verify is via isni.org
  let isOK: boolean = await verifyISNI(id);
  assertEquals(isOK, true);

  /* NOTE: getObjectISNI will always return undefined, there is no public JSON API end point.
  // getObject is via isni.org
  let obj: object | undefined = await getObjectISNI(id);
  assertNotEquals(obj, undefined);
  console.log(`DEBUG obj -> ${typeof obj} -> ${obj}`);
   */
}
