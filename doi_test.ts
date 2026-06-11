//
// DOI tests
//
import { assertEquals, assertNotEquals } from "@std/assert";

import {
  normalizeDOI,
  normalizeDOIShort,
  reDOI,
  validateDOI,
  validateDOIShort,
} from "./doi.ts";
import { getObjectDOI, verifyDOI } from "./doi_record.ts";

Deno.test("test normalizeDOI", () => {
  const tests: Array<[string, string]> = [
    ["10.22002/bv2pv-2b295", "https://doi.org/10.22002/bv2pv-2b295"],
    [
      "https://doi.org/10.22002/bv2pv-2b295",
      "https://doi.org/10.22002/bv2pv-2b295",
    ],
    [
      "  HTTPS://DOI.ORG/10.22002/BV2PV-2B295  ",
      "https://doi.org/10.22002/bv2pv-2b295",
    ],
  ];
  for (const [input, expected] of tests) {
    assertEquals(normalizeDOI(input), expected);
  }
});

Deno.test("test normalizeDOIShort", () => {
  const tests: Array<[string, string]> = [
    ["10.22002/bv2pv-2b295", "10.22002/bv2pv-2b295"],
    ["https://doi.org/10.22002/bv2pv-2b295", "10.22002/bv2pv-2b295"],
    ["  HTTPS://DOI.ORG/10.22002/BV2PV-2B295  ", "10.22002/bv2pv-2b295"],
  ];
  for (const [input, expected] of tests) {
    assertEquals(normalizeDOIShort(input), expected);
  }
});

Deno.test("test validateDOI and validateDOIShort", () => {
  const valid: string[] = [
    "10.22002/bv2pv-2b295",
    "https://doi.org/10.22002/bv2pv-2b295",
    "HTTPS://DOI.ORG/10.22002/BV2PV-2B295",
  ];
  for (const id of valid) {
    assertEquals(validateDOI(id), true, `expected validateDOI(${id}) true`);
    assertEquals(
      validateDOIShort(id),
      true,
      `expected validateDOIShort(${id}) true`,
    );
  }

  const invalid: string[] = [
    "",
    "not-a-doi",
    "10.123/abc", // registrant code too short, DOIPattern requires 4-9 digits
  ];
  for (const id of invalid) {
    assertEquals(validateDOI(id), false, `expected validateDOI(${id}) false`);
    assertEquals(
      validateDOIShort(id),
      false,
      `expected validateDOIShort(${id}) false`,
    );
  }
});

Deno.test("test doi", async () => {
  const verified_ids: string[] = [
    //"10.1000/xyz123",
    "10.22002/bv2pv-2b295",
    "https://doi.org/10.22002/1gffr-va537",
    "https://doi.org/10.22002/0c391-eeh07",
  ];

  for (const id of verified_ids) {
    // Normalize
    const normalized = normalizeDOI(id);
    assertNotEquals(normalized, undefined);
    assertEquals(
      reDOI.test(normalized),
      true,
      `expected ${normalized} to match DOIPattern`,
    );
    console.log(`Normalized DOI: ${normalized}`);
    // Validate
    assertEquals(validateDOI(id), true);
    // Verify
    const isOK: boolean = await verifyDOI(id);
    assertEquals(isOK, true, `expected true, got false for DOI ${id}`);
    const obj: object | undefined = await getObjectDOI(id);
    assertNotEquals(obj, undefined);
  }
});
