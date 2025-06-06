/**
 * bundle.ts is an example of "bundling" the type script file directory_client.ts
 * into a module and writing it to htdocs/modules.
 */
import { bundle } from "jsr:@deno/emit";

const result = await bundle("./mod.ts");
const { code } = result;
console.log(code);
//await Deno.mkdir("modules", { recursive: true, mode: 0o775 });
//await Deno.writeTextFile(js_name, code);
