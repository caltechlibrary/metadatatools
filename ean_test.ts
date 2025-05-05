//
// Test our EAN methods
//
import { assertEquals, assertNotEquals } from "@std/assert";

import { normalizeEAN, validateEAN } from "./ean.ts";

Deno.test("Deno test valid ean", () => {
  const varified_ids: string[] = [
    "9780201544282",
  ];

  for (const id of varified_ids) {
    // Normalize
    const expected = id;
    const normalized = normalizeEAN(id);
    assertEquals(
      normalized,
      expected,
      `expected normalizeEAN(${id}) to be "${expected}", got "${normalized}"`,
    );
    //console.log(`Normalized EAN: ${normalized}`);
    // Validate
    assertEquals(validateEAN(id), true);
    // NOTE: To verify the EAN you need an account on ean-search.org or other database.
    // You're best bet would be to treat the EAN as an ISBN and verify against a public resource
    // like Open Library or OCLC if you have access there.
  }

  const invalid_ids: string[] = [
    "xx000222jwwheeot",
  ];
  for (const id of invalid_ids) {
    // Normalize
    const expected = id.replaceAll(/[a-z]/g, "");
    const normalized = normalizeEAN(id);
    assertEquals(
      normalized,
      expected,
      `expected normalizeEAN(${id}) to be "${expected}", got "${normalized}"`,
    );
    assertNotEquals(
      normalized,
      id,
      `expected normalizeEAN(${id}) not to be equal to id "${id}", got "${normalized}"`,
    );
    //console.log(`Normalized EAN: ${normalized}`);
    // Validate
    assertEquals(validateEAN(id), false);
    // NOTE: To verify the EAN you need an account on ean-search.org or other database.
    // You're best bet would be to treat the EAN as an ISBN and verify against a public resource
    // like Open Library or OCLC if you have access there.
  }
});
