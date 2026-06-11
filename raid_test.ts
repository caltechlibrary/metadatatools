//
// RAiD tests
//
import { assertEquals } from "@std/assert";

import {
  normalizeRAiD,
  normalizeRAiDShort,
  validateRAiD,
  validateRAiDShort,
} from "./raid.ts";
import { validateDOI } from "./doi.ts";

Deno.test("test normalizeRAiD", () => {
  const tests: Array<[string, string]> = [
    ["10.26259/0e59e9a5", "https://raid.org/10.26259/0e59e9a5"],
    ["102.26259/0e59e9a5", "https://raid.org/102.26259/0e59e9a5"],
    [
      "https://raid.org/10.26259/0e59e9a5",
      "https://raid.org/10.26259/0e59e9a5",
    ],
    [
      "  HTTPS://RAID.ORG/10.26259/0E59E9A5  ",
      "https://raid.org/10.26259/0e59e9a5",
    ],
  ];
  for (const [input, expected] of tests) {
    assertEquals(normalizeRAiD(input), expected);
  }
});

Deno.test("test normalizeRAiDShort", () => {
  const tests: Array<[string, string]> = [
    ["10.26259/0e59e9a5", "10.26259/0e59e9a5"],
    ["102.26259/0e59e9a5", "102.26259/0e59e9a5"],
    ["https://raid.org/10.26259/0e59e9a5", "10.26259/0e59e9a5"],
    ["https://raid.org/102.26259/0e59e9a5", "102.26259/0e59e9a5"],
    ["  HTTPS://RAID.ORG/10.26259/0E59E9A5  ", "10.26259/0e59e9a5"],
  ];
  for (const [input, expected] of tests) {
    assertEquals(normalizeRAiDShort(input), expected);
  }
});

Deno.test("test validateRAiD and validateRAiDShort", () => {
  const valid: string[] = [
    "10.26259/0e59e9a5",
    "102.26259/0e59e9a5",
    "https://raid.org/10.26259/0e59e9a5",
    "https://raid.org/102.26259/0e59e9a5",
    "HTTPS://RAID.ORG/10.26259/0E59E9A5",
  ];
  for (const id of valid) {
    assertEquals(validateRAiD(id), true, `expected validateRAiD(${id}) true`);
    assertEquals(
      validateRAiDShort(id),
      true,
      `expected validateRAiDShort(${id}) true`,
    );
  }

  const invalid: string[] = [
    "",
    "not-a-raid",
    "11.26259/0e59e9a5", // does not start with 10 or 102
  ];
  for (const id of invalid) {
    assertEquals(
      validateRAiD(id),
      false,
      `expected validateRAiD(${id}) false`,
    );
    assertEquals(
      validateRAiDShort(id),
      false,
      `expected validateRAiDShort(${id}) false`,
    );
  }
});

// Documents the relationship between DOI and RAiD identifiers: RAiD reuses
// DOI's "10.xxxx/yyyy" identifier space (RAiDs are issued as DOIs via
// DataCite), so a bare "10.xxxx/yyyy" is valid as both a DOI and a RAiD. The
// "102.xxxx/yyyy" form is RAiD-exclusive, since DOI requires a literal "10."
// prefix.
Deno.test("test DOI/RAiD disambiguation", () => {
  const shared = "10.26259/0e59e9a5";
  assertEquals(validateDOI(shared), true);
  assertEquals(validateRAiD(shared), true);

  const raidOnly = "102.26259/0e59e9a5";
  assertEquals(validateDOI(raidOnly), false);
  assertEquals(validateRAiD(raidOnly), true);
});
