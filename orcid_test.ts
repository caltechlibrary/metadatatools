//
// Test our ORCID methods
//
import { assertEquals } from "@std/assert";

import { normalizeORCID, validateORCID } from "./orcid.ts";
import { verifyORCID } from "./orcid_record.ts";

const varified_ids: string[] = [
  "https://orcid.org/0000-0003-0900-6903",
  "0000-0002-6539-638X",
  "0000-0001-9266-5146",
  "0000-0002-0026-2516",
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeORCID(id);
  console.log(`Normalized ORCID: ${normalized}`);
  // Validate
  assertEquals(validateORCID(id), true);
  // Verify is via orcid.org
  let isOK: boolean = await verifyORCID(id);
  assertEquals(isOK, true);
}
