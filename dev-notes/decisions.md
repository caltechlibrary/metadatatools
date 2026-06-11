# dev-notes: decisions

Notes on changes to the public Go and TypeScript module behavior, and the
motivation behind them — especially breaking changes. Newest entries first.

---

## 2026-06-11: DOI normalization moves to extended (`https://doi.org/`) form; RAiD support added

### Summary of the change

**Breaking:** `NormalizeDOI` (Go) / `normalizeDOI` (TS) now return the
*extended* form of a DOI — `https://doi.org/10.xxxx/yyyy` — instead of the
previous bare/short form `10.xxxx/yyyy`. `ValidateDOI`/`validateDOI` and
`DOIPattern`/`reDOI` now match the extended form. Either a bare or
extended-form string is still accepted as *input* (Normalize/Validate
normalize internally first) — only the *output* of Normalize, and the
pattern Validate checks the result against, has changed.

**New, non-breaking:** `NormalizeDOIShort`/`normalizeDOIShort`,
`ValidateDOIShort`/`validateDOIShort`, and `DOIShortPattern`/`reDOIShort` are
added. These preserve the old bare-form behavior (`10.xxxx/yyyy`) for
existing code that needs it.

**New module:** `raid.go`/`raid.ts` add RAiD (Research Activity Identifier)
support, following the *new* convention from the start —
`NormalizeRAiD`/`normalizeRAiD` return `https://raid.org/10.xxxx/yyyy` (or
`102.xxxx/yyyy`), with `NormalizeRAiDShort`/`ValidateRAiDShort`/etc.
equivalents.

**Internal consumers updated:** `doi_record.go`/`doi_record.ts`
(`VerifyDOI`/`GetObjectDOI`/`verifyDOI`/`getObjectDOI`) now call
`NormalizeDOIShort`/`normalizeDOIShort` when constructing the
`doi.org/api/handles/`, `api.crossref.org/works/`, and
`api.datacite.org/dois/` request URLs, since those APIs expect the bare
`10.xxxx/yyyy` form.

### Motive

Two requests converged on this change:

1. A colleague asked for DOI normalization to use the full `https://doi.org/`
   URL form.
2. We needed to add RAiD support. RAiD identifiers are issued **as DOIs via
   DataCite** (https://support.datacite.org/docs/raids) — a RAiD's local
   identifier is the same `10.xxxx/yyyy` shape as a DOI
   (https://registry.identifiers.org/registry/raid, sample ID
   `10.26259/0e59e9a5`). That means a bare `10.xxxx/yyyy` string is
   *structurally ambiguous*: it could be a DOI or a RAiD, and no regex on the
   bare string can reliably tell them apart.

The resolver URL prefix — `https://doi.org/...` vs `https://raid.org/...` —
is the one thing that *can* tell them apart. Making that prefix the canonical
normalized form for both types turns the normalized value into a
self-describing tag: code that calls `NormalizeDOI` gets back something that
says "this is a DOI" on its face, and code that calls `NormalizeRAiD` gets
back something that says "this is a RAiD."

This isn't a new pattern for this codebase — `arxiv.go`/`arxiv.ts` already do
this with a CURIE-style tag instead of an HTTPS prefix:
`NormalizeArXivID("ARXIV:2412.03631")` returns `arxiv:2412.03631`, and
`arxiv_record.go` strips the `arxiv:` prefix before calling the
export.arxiv.org API. The DOI/RAiD change applies the same shape
(self-describing prefix in the normalized form, stripped by `_record.go` for
API calls) using HTTPS resolver prefixes instead of a CURIE scheme.

### Known residual ambiguity

A bare `10.xxxx/yyyy` (or even a `https://doi.org/...` URL) passed to
`NormalizeRAiD` is re-tagged as `https://raid.org/10.xxxx/yyyy` and will pass
`ValidateRAiD` — and vice versa for `NormalizeDOI`/`ValidateDOI`. This is
expected: the type tag reflects which function the caller chose, not an
inference about the input. The only string shape that is *exclusively* RAiD
(never a valid DOI) is the `102.xxxx/yyyy` form — DOI's pattern requires a
literal `10.` prefix, so `102.xxxx/yyyy` fails `ValidateDOI` but passes
`ValidateRAiD`.

### Migration notes

Code that called `NormalizeDOI`/`normalizeDOI` and relied on the bare-form
result (e.g. to build its own API URLs, store a short identifier, etc.)
should switch to `NormalizeDOIShort`/`normalizeDOIShort`. A grep across
`~/WorkLab` at the time of this change found no consumers of
`NormalizeDOI`/`ValidateDOI`/`reDOI`/`DOIPattern` outside metadatatools
itself, so the practical blast radius was limited to `doi_record.go`/
`doi_record.ts`.

### Versioning

This change ships with a minor version bump (`0.0.6` → `0.1.0` in
`version.go`) to flag the breaking change to `NormalizeDOI`'s output, per
semver conventions for `0.x` releases.

### See also

- [implementing_RAiD_support.md](implementing_RAiD_support.md) —
  implementation plan
- [decisions_RAiD_support.md](decisions_RAiD_support.md) — full
  design-decision record (naming, pattern choices, scope, alternatives
  considered)
