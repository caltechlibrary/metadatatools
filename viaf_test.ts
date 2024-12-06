//
// Test our VIAF ID methods
//
import { assertEquals } from "@std/assert";

import { normalizeVIAF, validateVIAF } from "./viaf.ts";
import { verifyVIAF } from "./viaf_record.ts";

const varified_ids: string[] = [
  "108127625",
  "101062721",
  "14957683",
  "117619223",
  "53323307"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeVIAF(id);
  console.log(`Normalized VIAF ID: ${normalized}`);
  // Validate
  assertEquals(validateVIAF(id), true);
  // Verify is via CrossRef
  let isOK: boolean = await verifyVIAF(id);
  assertEquals(isOK, true);
}
