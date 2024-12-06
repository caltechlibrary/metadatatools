//
// Test our PMCID methods
//
import { assertEquals } from "@std/assert";

import { normalizePMCID, validatePMCID } from "./pmcid.ts";
import { verifyPMCID } from "./pmcid_record.ts";

const varified_ids: string[] = [
    "PMC11021482",
    "10557066"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizePMCID(id);
  console.log(`Normalized PMCID: ${normalized}`);
  // Validate
  assertEquals(validatePMCID(id), true);
  // Verify is via pmcid.org
  let isOK: boolean = await verifyPMCID(id);
  assertEquals(isOK, true);
}
