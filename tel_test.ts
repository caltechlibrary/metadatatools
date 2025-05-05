import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeTEL, validateTEL } from "./tel.ts";

Deno.test("test tel", () => {
  const varified_ids: string[] = [
    "111-2222",
    "111-222-3333",
    "1-222-333-4444",
    "11-222-333-4444",
    "111-222-333-4444",
  ];

  for (const id of varified_ids) {
    // Normalize
    const normalized = normalizeTEL(id);
    assertNotEquals(normalized, undefined);
    console.log(`Normalized Tel: ${normalized}`);
    // Validate
    assertEquals(validateTEL(id), true);
  }
});
