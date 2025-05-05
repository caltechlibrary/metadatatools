//
// Test our ArXiv methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeArXivID, validateArXivID } from "./arxiv.ts";
import { verifyArXivID } from "./arxiv_record.ts";

const varified_ids: string[] = [
  "arXiv:2412.03631",
  "arXiv:2412.03649",
  "arXiv:2412.04386",
];

for (const id of varified_ids) {
  // Normalize
  const normalized = normalizeArXivID(id);
  assertNotEquals(normalized, undefined);
  // Validate
  assertEquals(validateArXivID(id), true);
  // Verify is via arxiv.org
  const isOK: boolean = await verifyArXivID(id);
  assertEquals(isOK, true);
}
