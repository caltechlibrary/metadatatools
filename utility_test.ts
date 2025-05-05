import { assertEquals, assertNotEquals } from "@std/assert";
import { verifyIdentifier, getObject } from "./utility.ts";

function noOp(s: string): boolean {
    return true;
}

Deno.test('test verifyIdentifier', async function() {
    const object_urls: string[] = [
        "https://caltechlibrary.github.io/dataset/README.md",
    ];
        
    for (let url of object_urls) {
        let res = await verifyIdentifier(url, url, noOp);
        assertEquals(res, true);
    }
});

Deno.test("test getObject", async function() {
    const object_urls: string [] = [
        "https://feeds.library.caltech.edu/recent/article.json",
    ];
    for (let url of object_urls) {
        let res = await getObject(url, url, noOp);
        //console.log(`DEBUG res -> ${res}`);
        assertNotEquals(res, undefined);
    }
});
