//
// Test our SNAC ID methods
//
import { assertEquals } from "@std/assert";

import { normalizeSNAC, validateSNAC } from "./snac.ts";
import { verifySNAC } from "./snac_record.ts";

const varified_ids: string[] = [
  "108127625",
  "101062721",
  "14957683",
  "117619223",
  "53323307"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeSNAC(id);
  console.log(`Normalized SNAC ID: ${normalized}`);
  // Validate
  assertEquals(validateSNAC(id), true);
  // Verify is via CrossRef
  let isOK: boolean = await verifySNAC(id);
  assertEquals(isOK, true);
}
