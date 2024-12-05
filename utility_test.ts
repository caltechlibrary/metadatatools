import { assert } from "jsr:@std/assert";
import * as utility from "./utility.ts";

const verified_ids: string[] = [
    "https://caltechlibrary.github.io/dataset/README.md"
];

function noOp(s: string): boolean {
    return true;
}

for (let id of verified_ids) {
    let res = await utility.verifyIdentifier(id, id, noOp);
    assert(res);
}
