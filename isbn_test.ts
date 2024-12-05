//
// Test our isbn methods
//
import { assert } from "jsr:@std/assert";

import { normalizeISBN, validateISBN } from "./isbn.ts";
import { verifyISBN, getObjectISBN } from "./isbn_record.ts";

const varified_ids: string[] = [
  "978-3-16-148410-0",
  "978-1606069424",
  "160606942X",
];

for (let id of varified_ids) {
  // Normalize
  let normalized = normalizeISBN(id);
  console.log(`Normalized ISBN: ${normalized}`);
  // Validate
  assert(validateISBN(id));
  // Verify
  let isOK: boolean = await verifyISBN(id);
  assert(isOK);
  let obj: object | undefined = await getObjectISBN(id);
  assert(obj !== undefined);
  //console.log(`DEBUG obj -> ${JSON.stringify(obj)}`);
}
