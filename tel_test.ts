import { assertEquals } from "@std/assert";

import { normalizeTEL, validateTEL } from './tel.ts';

const varified_ids: string[] = [
    "111-2222",
    "111-222-3333",
    "1-222-333-4444",
    "11-222-333-4444",
    "111-222-333-4444",
];

for (let id of varified_ids) {
    // Normalize
    let normalized = normalizeTEL(id);
    console.log(`Normalized Tel: ${normalized}`);
    // Validate
    assertEquals(validateTEL(id), true);
}
  