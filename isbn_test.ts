//
// Test our isbn methods
//
import { assertEquals, assertNotEquals } from "jsr:@std/assert";

import { normalizeISBN, validateISBN } from "./isbn.ts";
import { verifyISBN } from "./isbn_record.ts";

const varified_ids: string[] = [
  "0-306-40615-2",
  "978-3-16-148410-0",
  "978-1606069424",
  "160606942X",
];

for (const id of varified_ids) {
  // Normalize
  const normalized = normalizeISBN(id);
  assertNotEquals(normalized, undefined);
  console.log(`Normalized ISBN: ${normalized}`);
  // Validate
  assertEquals(validateISBN(id), true);
  // Verify
  const isOK: boolean = await verifyISBN(id);
  assertEquals(isOK, true);
}
