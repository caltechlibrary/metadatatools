//
// Test our ArXiv methods
//
import { assertEquals } from "@std/assert";

import { normalizeArXivID, validateArXivID } from "./arxiv.ts";
import { verifyArXivID } from "./arxiv_record.ts";

const varified_ids: string[] = [
    "arXiv:2412.03631",
    "arXiv:2412.03649",
    "arXiv:2412.04386"
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeArXivID(id);
  console.log(`Normalized ArXiv: ${normalized}`);
  // Validate
  assertEquals(validateArXivID(id), true);
  // Verify is via arxiv.org
  let isOK: boolean = await verifyArXivID(id);
  assertEquals(isOK, true);
}
