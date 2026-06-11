---
title: RAiD support — design decisions
---

# Design decisions: RAiD support

This document records the design decisions made while adding RAiD (Research
Activity Identifier) support to metadatatools, and the related change to how
DOI is normalized. See [implementing_RAiD_support.md](implementing_RAiD_support.md)
for the implementation plan that follows from these decisions.

## Background

RAiD is a persistent identifier for research projects/activities, governed by
ISO 23527:2022 and operated by ARDC (Australian Research Data Commons). RAiDs
are issued **as DOIs via DataCite** — the local identifier is DOI-shaped.

- identifiers.org local-ID pattern: `^102?\.\d+/.+$` (i.e. prefix is `10.` or
  `102.`, then digits, `/`, suffix)
- Sample ID: `10.26259/0e59e9a5`
- Resolution: `https://raid.org/{id}`, e.g. `https://raid.org/10.26259/0e59e9a5`

Sources:
- https://registry.identifiers.org/registry/raid (MIR:00001107, pattern
  `^102?\.\d+\/.+$`, sample ID `10.26259/0e59e9a5`, resource
  `https://raid.org/{$id}`)
- https://bioregistry.io/raid
- https://support.datacite.org/docs/raids ("RAiD RAs will use DataCite
  services to issue DOIs as RAiD identifiers")

Because RAiD reuses DOI's `10.xxxx/yyyy` identifier space, a *bare*
`10.26259/0e59e9a5` is structurally ambiguous — it satisfies both a DOI
pattern and a RAiD pattern. Only the `102.xxxx/yyyy` form (allowed for RAiD,
not for DOI) and/or the resolver host (`doi.org` vs `raid.org`) can
disambiguate.

## D1: Identifier naming — "RAiD" vs "RAID"

**Decision:** Use the official mixed-case branding "RAiD" in exported
identifiers: `NormalizeRAiD`, `ValidateRAiD`, `RAiDPattern`, `reRAiD`,
`RAiDPrefix`, files `raid.go`/`raid.ts`/`raid_test.go`/`raid_test.ts`.

**Rationale:** User chose to match ARDC/ISO 23527 branding exactly, even
though it departs from the all-caps acronym convention used for DOI, ROR,
ORCID, ISNI, etc.

## D2: RAiD short-form digit pattern — bounded vs unbounded

**Decision:** `RAiDShortPattern = ^102?\.\d+/[^\s]+$` — unbounded `\d+`,
matching the identifiers.org spec exactly (no `{4,9}` bound as DOI has).

**Rationale:** Follow the published spec rather than assume RAiD registrant
codes will follow DOI's 4-9 digit convention.

## D3: Canonical normalize form — extended (full URL) vs short (bare)

**Decision:**

- `NormalizeDOI` / `NormalizeRAiD` (primary, new behavior) always return the
  **extended/full URL form**: `https://doi.org/10.xxxx/yyyy` and
  `https://raid.org/10.xxxx/yyyy` (or `102.xxxx/yyyy`) respectively.
- `NormalizeDOIShort` / `NormalizeRAiDShort` (new functions) return the
  **short/bare form**: `10.xxxx/yyyy` / `102.xxxx/yyyy`. This is the old
  `NormalizeDOI` behavior, preserved for older use cases (e.g. building
  CrossRef/DataCite/handle-system API URLs in `doi_record.go`/`doi_record.ts`).
- `ValidateDOI` / `ValidateRAiD` validate the extended form (after
  normalizing). `ValidateDOIShort` / `ValidateRAiDShort` validate the short
  form (after short-normalizing).
- Both Normalize variants accept either a bare identifier or a full URL as
  *input* — the difference is only in the output shape.

**Rationale:** A colleague requested DOI normalization move to the full
`https://doi.org/...` URL form. Combined with the ambiguity in D-Background,
the resolver-prefixed form becomes the practical way downstream code
distinguishes "this is a DOI" from "this is a RAiD" — the prefix is a
self-describing tag on the normalized value, attached based on which
`Normalize*` function the data flowed through. This mirrors the existing
`arxiv.go` convention, where `NormalizeArXivID` returns a CURIE-tagged value
(`arxiv:2412.03631`) and `arxiv_record.go` strips the `arxiv:` prefix before
calling the export.arxiv.org API — see `arxiv_record.go:8-10`. The DOI/RAiD
case uses an HTTPS resolver prefix instead of a CURIE scheme, but the
"tagged normalized form, stripped by `_record.go` for API calls" shape is the
same.

**Alternatives considered:**
- *Host-aware Normalize/Validate* (only strip/accept a URL if its host
  matches the type's own resolver, otherwise fail validation for that type) —
  rejected as unnecessarily strict and a bigger behavioral change for little
  benefit, given the bare-form ambiguity can't be fully resolved either way.
- *Lightweight prefix constants only* (no change to Normalize output shape) —
  superseded once the colleague's "normalize to full URL" request came in;
  D3 subsumes this (constants `DOIPrefix`/`RAiDPrefix` are still added).

**Consequence — known residual ambiguity:** Given a bare `10.xxxx/yyyy` (or
even a `https://doi.org/...` URL) as input, `ValidateRAiD` will still return
`true` after `NormalizeRAiD` re-tags it with `https://raid.org/...`, and vice
versa for `ValidateDOI`. This is intentional and unavoidable — format alone
cannot exclude one type or the other for the shared `10.xxxx/yyyy` space;
only `102.xxxx/yyyy` is RAiD-exclusive (see D2 and the test plan).

## D4: doi_record.go / doi_record.ts updates

**Decision:** `VerifyDOI`/`verifyDOI` and `GetObjectDOI`/`getObjectDOI` switch
their internal normalization call from `NormalizeDOI`/`normalizeDOI` to
`NormalizeDOIShort`/`normalizeDOIShort` when building the
`doi.org/api/handles/`, `api.crossref.org/works/`, and
`api.datacite.org/dois/` URLs (these endpoints expect the bare `10.xxxx/yyyy`
form). The `Validate{...}` passed to `VerifyIdentifier`/`GetObject` remains
`ValidateDOI`/`validateDOI` (extended-form validator), applied to the
caller's original input.

**Rationale:** Required by D3 — these are exactly the "older use cases" the
short-form functions exist for. No other internal or external consumers of
`NormalizeDOI`/`ValidateDOI`/`reDOI`/`DOIPattern`/`VerifyDOI`/`GetObjectDOI`
were found anywhere under `~/WorkLab` (checked via grep), so blast radius
within this workspace is limited to these two files.

## D5: RAiD verification/record — out of scope for this pass

**Decision:** No `raid_record.go`/`raid_record.ts` in this pass.
`cmd/mdtools/main.go`'s `case "raid":` registers `nil` for the verify
function, the same as `ean`, `email`, `tel`, and `uuid`.

**Rationale:** No confirmed RAiD-specific verification API. RAiDs are
DataCite DOIs, so `https://api.datacite.org/dois/{short}` is a plausible
future `GetObjectRAiD` backend (mirroring DOI's DataCite fallback), but this
needs confirmation before implementing. Can be added later without touching
the validate/normalize surface.

## D6: Versioning

**Decision:** This release increments the **minor** version number
(currently `0.0.6` in `version.go`, e.g. → `0.1.0`).

**Rationale:** `NormalizeDOI`'s canonical output format changes
(`10.xxxx/yyyy` → `https://doi.org/10.xxxx/yyyy`), which is a breaking change
to anyone relying on the old bare-form output, even though
`NormalizeDOIShort` provides a migration path. Flagging via a minor version
bump per the user's plan; actual `version.go`/changelog edits happen at
release time, not as part of this implementation pass.

## D7: CLI exposure of `*Short` functions

**Decision:** `cmd/mdtools/main.go` gains `case "doi-short":` and
`case "raid-short":`, dispatching to
`NormalizeDOIShort`/`ValidateDOIShort`/`VerifyDOI` and
`NormalizeRAiDShort`/`ValidateRAiDShort`/`nil` respectively. `helptext.go`
documents both as bare `10.xxxx/yyyy` (and `102.xxxx/yyyy` for RAiD) forms;
`raid-short` is annotated "(verification unavailable)" like `raid`.

**Rationale:** CLI users who relied on `mdtools normalize doi ...` returning
the bare form now have a direct, documented equivalent — the same migration
path `NormalizeDOIShort`/`normalizeDOIShort` already provide for library
consumers (see [decisions.md](decisions.md)). `verify doi-short` reuses
`VerifyDOI` since `VerifyDOI` already normalizes to short form internally
before calling the handle-system API, so behavior is identical to
`verify doi`.

A grep across `~/WorkLab` found no scripts depending on the old bare-form CLI
output, so this isn't fixing a known breakage — it's closing the gap so the
*-short forms are reachable from the CLI, not just the Go/TS APIs.

**Update:** `cmd/mdtools.ts` (the Deno/TS CLI entry point) was already out of
sync with `cmd/mdtools/main.go` — missing `ean`, `fundref`, `raid`, and now
`doi-short`/`raid-short` as well. As part of the same release, the project's
build/release process was revised so the `mdtools` binary is built solely from
`cmd/mdtools/main.go` (Go), cross-compiled for all release platforms.
`cmd/mdtools.ts` and its sole dependency `deps.ts` were removed rather than
kept in sync — the TypeScript side remains fully supported as a library
(`mod.ts`), just without a separate CLI entry point. See `git log` for the
Makefile/`deno.json` changes.
