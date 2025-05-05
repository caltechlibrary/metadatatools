//
// Test our ISNI methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeISNI, validateISNI } from "./isni.ts";
import { verifyISNI } from "./isni_record.ts";

const varified_ids: string[] = [
  "0000 0001 2096 0218",
  "0000 0000 8405 6132",
  "0000 0000 7182 7209",
];

for (const id of varified_ids) {
  // Normalize
  const normalized = normalizeISNI(id);
  assertNotEquals(normalized, undefined);
  console.log(`Normalized ISNI: ${normalized}`);
  // Validate
  assertEquals(validateISNI(id), true);
  // Verify is via isni.org
  const isOK: boolean = await verifyISNI(id);
  assertEquals(isOK, true);
}
