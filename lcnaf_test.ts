//
// Test our LCNAF ID methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeLCNAF, validateLCNAF } from "./lcnaf.ts";
import { verifyLCNAF } from "./lcnaf_record.ts";

const varified_ids: string[] = [
  "n81044376",
  "no2023032145",
  "no2022139137",
];

for (const id of varified_ids) {
  // Normalize
  const normalized = normalizeLCNAF(id);
  assertNotEquals(normalized, undefined);
  console.log(`Normalized LCNAF ID: ${normalized}`);
  // Validate
  assertEquals(validateLCNAF(id), true);
  // Verify is via CrossRef
  const isOK: boolean = await verifyLCNAF(id);
  assertEquals(isOK, true);
}
