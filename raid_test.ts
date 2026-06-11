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
    ["10.83962/fb5be317", "https://raid.org/10.83962/fb5be317"],
    [
      "https://raid.org/10.26259/0e59e9a5",
      "https://raid.org/10.26259/0e59e9a5",
    ],
    [
      "https://raid.org/10.83962/f2a7645d",
      "https://raid.org/10.83962/f2a7645d",
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
    ["10.83962/fb5be317", "10.83962/fb5be317"],
    ["https://raid.org/10.26259/0e59e9a5", "10.26259/0e59e9a5"],
    ["https://raid.org/10.83962/f2a7645d", "10.83962/f2a7645d"],
    ["  HTTPS://RAID.ORG/10.26259/0E59E9A5  ", "10.26259/0e59e9a5"],
  ];
  for (const [input, expected] of tests) {
    assertEquals(normalizeRAiDShort(input), expected);
  }
});

Deno.test("test validateRAiD and validateRAiDShort", () => {
  const valid: string[] = [
    "10.26259/0e59e9a5",
    "10.83962/fb5be317",
    "https://raid.org/10.26259/0e59e9a5",
    "https://raid.org/10.83962/f2a7645d",
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
    "11.26259/0e59e9a5", // does not start with 10
    "102.26259/0e59e9a5", // "102." is not a real RAiD prefix, see D8
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

// Documents the relationship between DOI and RAiD identifiers: RAiDs are
// issued as DOIs via DataCite, so RAiD and DOI share the same
// "10.<4-9 digit registrant code>/<suffix>" format. There is no
// format-level way to distinguish a RAiD from a DOI - any valid RAiD is also
// a valid DOI, and vice versa. See dev-notes/decisions_RAiD_support.md D8.
Deno.test("test RAiD is DOI-shaped", () => {
  const shared = ["10.26259/0e59e9a5", "10.83962/fb5be317"];
  for (const id of shared) {
    assertEquals(validateDOI(id), true, `expected validateDOI(${id}) true`);
    assertEquals(validateRAiD(id), true, `expected validateRAiD(${id}) true`);
  }
});
