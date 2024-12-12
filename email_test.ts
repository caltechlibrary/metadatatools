import { assertEquals } from "@std/assert";

import { normalizeEMAIL, validateEMAIL } from './email.ts';

const varified_ids: string[] = [
    "a@localhost",
    "a.b@localhost",
    "b_2@example.edu",
    "b3@library.example.edu",
    "b4@agents.library.example.edu",
];

for (let id of varified_ids) {
    // Normalize
    let normalized = normalizeEMAIL(id);
    console.log(`Normalized Email: ${normalized}`);
    // Validate
    assertEquals(validateEMAIL(id), true);
}
  