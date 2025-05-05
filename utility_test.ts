import { assertEquals, assertNotEquals } from "@std/assert";
import { getObject, verifyIdentifier } from "./utility.ts";

function noOp(_s?: string): boolean {
  return true;
}

Deno.test("test verifyIdentifier", async function () {
  const object_urls: string[] = [
    "https://caltechlibrary.github.io/dataset/README.md",
  ];

  for (const url of object_urls) {
    const res = await verifyIdentifier(url, url, noOp);
    assertEquals(res, true);
  }
});

Deno.test("test getObject", async function () {
  const object_urls: string[] = [
    "https://feeds.library.caltech.edu/recent/article.json",
  ];
  for (const url of object_urls) {
    const res = await getObject(url, url, noOp);
    //console.log(`DEBUG res -> ${res}`);
    assertNotEquals(res, undefined);
  }
});
