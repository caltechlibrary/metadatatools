
# Action items

## Documentation

- [ ] **Document that this repository holds two independent implementations,
  in Go and in TypeScript/JavaScript.** The arrangement is not obvious from the
  documentation and has already been misread.

  What the documentation needs to say:

  - **Both languages are supported, as peers.** Neither is the primary and
    neither is a port of the other.
  - **The Go code does not import the TypeScript/JavaScript code, and the
    TypeScript/JavaScript code does not import the Go code.** They share no
    runtime, no build step and no generated intermediate. Each is a complete,
    standalone implementation for its own ecosystem.
  - **Why both exist:** each fills a void in its own language's ecosystem —
    the void that Python fills with the
    [idutils](https://idutils.readthedocs.io/en/latest/) package. There was no
    equivalent for Go, and none for TypeScript/JavaScript.
  - **Why they live in one repository:** it is easier to keep the two in sync
    while they are under active development. Co-location is a development
    convenience, not a technical dependency between them.

  Why this is worth writing down — the current state of the docs:

  - `README.md` **never mentions Go at all.** A reader would not learn the Go
    implementation exists.
  - `README.md`'s USAGE section opens "There are three ways to use Metadata
    Tools", then describes only two: the `mdtools` command line program and
    the TypeScript ESM module. The third is never stated. Presumably it is the
    Go module.
  - `user_manual.md` mentions neither Go nor TypeScript.
  - Meanwhile the repository root carries `go.mod`
    (`github.com/caltechlibrary/metadatatools`, Go 1.26.3) beside `deno.json`
    and `mod.ts`, and **53 `.go` files paired one-to-one with 53 `.ts`
    files** — every identifier type implemented twice, tests included. The
    only unpaired TypeScript files are `mod.ts`, the ESM entry point, and
    `demo_module.ts`. There are no unpaired Go files.

  Done looks like: `README.md` states the two-language arrangement and the
  reasoning above near the top, its "three ways" list is completed with the Go
  module, `INSTALL.md` is clear about which toolchain installs which, and
  `user_manual.md` says which language each example is in. The independence of
  the two implementations should be explicit enough that nobody tries to wire
  them together, and nobody assumes one is generated from the other.
