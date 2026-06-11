---
title: Implementing RAiD support
---

# Implementing RAiD support

This is the implementation plan for adding RAiD (Research Activity
Identifier) support to metadatatools, alongside a related change to DOI
normalization. The design rationale and alternatives considered are recorded
in [decisions_RAiD_support.md](decisions_RAiD_support.md); read that first if
the "why" behind any step here isn't obvious.

## Scope

### In scope

- `doi.go` / `doi.ts` — add extended-form (`https://doi.org/...`) as the
  primary normalized form, add `*Short` variants for the existing bare-form
  behavior.
- `doi_record.go` / `doi_record.ts` — update to use the short-form
  normalization when constructing API URLs.
- `raid.go` / `raid.ts` — new module, mirrors the new DOI shape.
- `raid_test.go` / `raid_test.ts` — new, format-only tests (no network).
- `doi_test.go` / `doi_test.ts` — updated for the new normalize/validate
  behavior and `*Short` variants.
- Registration: `helptext.go`, `cmd/mdtools/main.go`, `mod.ts`.
- `mdtools.1.md` / `README.md` — update the ID_TYPE list if generated/listed
  there (check `mdtools.1.md` for "ROR"/"DOI" — appears to enumerate the same
  list as `helptext.go`).

### Out of scope (deferred)

- `raid_record.go` / `raid_record.ts` (`VerifyRAiD` / `GetObjectRAiD`) — see
  decisions doc D5.
- `version.go` bump and changelog entry — done at release time (D6).

## Design summary

### 1. doi.go / doi.ts (modified)

```go
// DOIPrefix is the canonical resolver URL prefix for a DOI.
const DOIPrefix = "https://doi.org/"

// DOIPattern matches a normalized (extended/full URL) DOI.
const DOIPattern = `^https://doi\.org/10\.\d{4,9}/[^\s]+$`
var reDOI = regexp.MustCompile(DOIPattern)

// DOIShortPattern matches a normalized short-form (bare) DOI.
const DOIShortPattern = `^10\.\d{4,9}/[^\s]+$`
var reDOIShort = regexp.MustCompile(DOIShortPattern)

// NormalizeDOIShort is today's NormalizeDOI body, unchanged:
// lowercase, trim, strip any URL down to bare "10.xxxx/yyyy".
func NormalizeDOIShort(doi string) string { ... }

// NormalizeDOI returns the extended form.
func NormalizeDOI(doi string) string {
    return DOIPrefix + NormalizeDOIShort(doi)
}

func ValidateDOI(doi string) bool {
    return reDOI.MatchString(NormalizeDOI(doi))
}

func ValidateDOIShort(doi string) bool {
    return reDOIShort.MatchString(NormalizeDOIShort(doi))
}
```

TS mirrors with `DOIPrefix`, `DOIPattern`, `reDOI`, `DOIShortPattern`,
`reDOIShort`, `normalizeDOIShort`, `normalizeDOI`, `validateDOI`,
`validateDOIShort` (camelCase functions, PascalCase pattern/prefix consts —
matches existing `doi.ts`/`ror.ts` convention).

### 2. doi_record.go / doi_record.ts (modified)

```go
func VerifyDOI(doi string) bool {
    short := NormalizeDOIShort(doi)
    return VerifyIdentifier(doi, "https://doi.org/api/handles/"+url.QueryEscape(short), ValidateDOI)
}

func GetObjectDOI(doi string) (interface{}, bool) {
    short := NormalizeDOIShort(doi)
    obj, ok := GetObject(doi, "https://api.crossref.org/works/"+url.QueryEscape(short), ValidateDOI)
    if !ok {
        return GetObject(doi, "https://api.datacite.org/dois/"+url.QueryEscape(short), ValidateDOI)
    }
    return obj, ok
}
```

Same change in `doi_record.ts` (`normalizeDOIShort` instead of
`normalizeDOI` when building URLs; `validateDOI` unchanged as the gate).

### 3. raid.go / raid.ts (new)

```go
const RAiDPrefix = "https://raid.org/"

const RAiDPattern = `^https://raid\.org/102?\.\d+/[^\s]+$`
var reRAiD = regexp.MustCompile(RAiDPattern)

const RAiDShortPattern = `^102?\.\d+/[^\s]+$`
var reRAiDShort = regexp.MustCompile(RAiDShortPattern)

func NormalizeRAiDShort(raid string) string { ... } // mirrors NormalizeDOIShort
func NormalizeRAiD(raid string) string {
    return RAiDPrefix + NormalizeRAiDShort(raid)
}
func ValidateRAiD(raid string) bool {
    return reRAiD.MatchString(NormalizeRAiD(raid))
}
func ValidateRAiDShort(raid string) bool {
    return reRAiDShort.MatchString(NormalizeRAiDShort(raid))
}
```

TS mirrors with the same naming scheme as DOI.

### 4. Registration

- `helptext.go`: add `- RAiD` to the ID_TYPE list (after DOI seems natural,
  given the relationship).
- `cmd/mdtools/main.go`: add
  ```go
  case "raid":
      exitCode = action(metadatatools.NormalizeRAiD, metadatatools.ValidateRAiD, nil, verb, identifier)
  ```
  (nil verify, see decisions D5 — matches the `ean`/`email`/`tel`/`uuid`
  pattern.)
- `mod.ts`: extend the DOI export line with `DOIPrefix`, `DOIShortPattern`,
  `reDOIShort`, `normalizeDOIShort`, `validateDOIShort`; add a new RAiD
  export line with `RAiDPrefix`, `RAiDPattern`, `RAiDShortPattern`, `reRAiD`,
  `reRAiDShort`, `normalizeRAiD`, `normalizeRAiDShort`, `validateRAiD`,
  `validateRAiDShort`.
- `mdtools.1.md` / `README.md`: add RAiD to the supported ID_TYPE list if it
  duplicates `helptext.go`'s list (confirm during implementation).

## Implementation steps (TDD order)

1. **Update `doi_test.go` / `doi_test.ts`**
   - Add format-only test(s) (no network) covering:
     - `NormalizeDOI("10.22002/bv2pv-2b295")` ==
       `"https://doi.org/10.22002/bv2pv-2b295"`
     - `NormalizeDOI("https://doi.org/10.22002/1gffr-va537")` ==
       `"https://doi.org/10.22002/1gffr-va537"` (idempotent on extended input)
     - `NormalizeDOIShort("https://doi.org/10.22002/1gffr-va537")` ==
       `"10.22002/1gffr-va537"`
     - `ValidateDOI(...)` true for both bare and extended input forms
     - `ValidateDOIShort(...)` true for both bare and extended input forms
   - Update the existing network-gated `TestDOI` /
     `Deno.test("test doi")` so any normalized-value assertions reflect the
     new extended-form output.

2. **Add `raid_test.go` / `raid_test.ts`** (format-only, no network)
   - `NormalizeRAiD("10.26259/0e59e9a5")` ==
     `"https://raid.org/10.26259/0e59e9a5"`
   - `NormalizeRAiD("https://raid.org/10.26259/0e59e9a5")` ==
     `"https://raid.org/10.26259/0e59e9a5"` (idempotent)
   - `NormalizeRAiD("102.26259/0e59e9a5")` ==
     `"https://raid.org/102.26259/0e59e9a5"`
   - `NormalizeRAiDShort("https://raid.org/10.26259/0e59e9a5")` ==
     `"10.26259/0e59e9a5"`
   - `ValidateRAiD(...)` true for `10.x/y`, `102.x/y`, and their
     `https://raid.org/...` forms
   - `ValidateRAiDShort(...)` true for the same set
   - Cross-check (documents the D3 residual ambiguity / D2 disambiguator):
     - `ValidateDOI("102.26259/0e59e9a5")` == `false` (DOI requires literal
       `10.`, not `102.`)
     - `ValidateRAiD("102.26259/0e59e9a5")` == `true`

3. **Run tests, confirm red**: `go test ./...` and `deno test` — new/updated
   assertions should fail against the current implementation.

4. **Implement `doi.go`** per Design Summary §1.

5. **Implement `doi.ts`** mirroring §1.

6. **Implement `doi_record.go`** per §2.

7. **Implement `doi_record.ts`** mirroring §2.

8. **Implement `raid.go`** per §3.

9. **Implement `raid.ts`** mirroring §3.

10. **Registration** per §4: `helptext.go`, `cmd/mdtools/main.go`, `mod.ts`,
    and `mdtools.1.md`/`README.md` if applicable.

11. **Run tests, confirm green**: `go test ./...` and `deno test`.

12. **Format/lint**: `gofmt -l .`, `go vet ./...`, `deno fmt`, `deno lint`.

13. **Manual CLI smoke test**:
    ```sh
    go run ./cmd/mdtools normalize doi 10.22002/bv2pv-2b295
    go run ./cmd/mdtools validate doi 10.22002/bv2pv-2b295
    go run ./cmd/mdtools normalize raid 10.26259/0e59e9a5
    go run ./cmd/mdtools validate raid 102.26259/0e59e9a5
    ```

## Open items for review

- See decisions doc's "Open question for review" — whether to add
  `doi-short`/`raid-short` CLI id-types.
- Confirm placement of RAiD in `helptext.go`'s ID_TYPE list and whether
  `mdtools.1.md`/`README.md` need a matching edit (to be confirmed once those
  files are checked during implementation).
- `version.go` bump (`0.0.6` → `0.1.0`) and any CHANGELOG entry — confirm
  whether to do this now or leave for a separate release commit.
