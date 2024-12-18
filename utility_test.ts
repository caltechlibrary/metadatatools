import { assertEquals } from "@std/assert";
import {verifyIdentifier } from "./utility.ts";

const verified_ids: string[] = [
    "https://caltechlibrary.github.io/dataset/README.md"
];

function noOp(s: string): boolean {
    return true;
}

for (let id of verified_ids) {
    let res = await verifyIdentifier(id, id, noOp);
    assertEquals(res, true);
}
