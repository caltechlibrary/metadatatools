//
// Test our PMID methods
//
import { assertEquals } from "@std/assert";

import { normalizePMID, validatePMID } from "./pmid.ts";
import { verifyPMID } from "./pmid_record.ts";

const varified_ids: string[] = [
    "34125777",
    "PMID: 25591183"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizePMID(id);
  console.log(`Normalized PMID: ${normalized}`);
  // Validate
  assertEquals(validatePMID(id), true);
  // Verify is via pmid.org
  let isOK: boolean = await verifyPMID(id);
  assertEquals(isOK, true);
}
