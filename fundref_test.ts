//
// Test our FundRef ID methods
//
import { assertEquals } from "@std/assert";

import { normalizeFundRefID, validateFundRefID } from "./fundref.ts";
import { verifyFundRefID } from "./fundref_record.ts";

const varified_ids: string[] = [
    "10.13039/100000001",
    "10.13039/100000009"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeFundRefID(id);
  console.log(`Normalized FundRef ID: ${normalized}`);
  // Validate
  assertEquals(validateFundRefID(id), true);
  // Verify is via CrossRef
  let isOK: boolean = await verifyFundRefID(id);
  assertEquals(isOK, true);
}
