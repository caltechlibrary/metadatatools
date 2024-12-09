---
title: Metadata Tools
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: A brief overview of proposed project and approach.
urlcolor: blue
linkstyle: bold
aspectratio: 169
createDate: 2024-12-06
updateDate: 2024-11-09
draft: true
#pubDate: 2024-11-15
place: Caltech
section-titles: false
toc: true
keywords: [ "metadata", "identifiers", "normalizaiton", "validation", "verification", "TypeScript", "Deno" ]
url: "https://caltechlibrary.github.io/metadatatools"
---

# What is the Metadata Tools Project?

- An ESM (ECMAScript Module) for working with identifiers used by libraries and archives in TypeScript

# Why create the Metadata Tools Project?

If you working in Python you can use [idutils](https://idutils.readthedocs.io/). I needed a similar capabilities in non-Python code spaces
like my web browser or [Deno](https://deno.com). With Metadata Tools perform similar function server side (via Deno) and browser side,
in other languages via compile to WASM or in the web browser via transpilation to JavaScript.

Metadata Tools seeks to be very portable across languages that support WASM, native binary executables and in web browsers.

# What identifiers does it support?

- ArXiv ID
- DOI
- ISBN
- ISSN
- ISNI
- ORCID
- PMID
- PMCID
- ROR
- LCNAF
- VIAF
- SNAC

# How do I use Metadata Tools in TypeScript and Deno?

```TypeScript
import * as mt from 'https://caltechlibrary.github.io/metadatatools/mod.ts';
```

# Example source

```TypeScript
import {
  normalizeDOI, normalizeORCID, normalizeROR,
  validateDOI, validateORCID, validateROR,
  verifyDOI, verifyORCID, verifyROR,
} from "./mod.ts";

const orcid = "0000-0003-0900-6903",
  verifiedORCID = await verifyORCID(orcid),
  ror = "https://ror.org/00mpvse27",
  verifiedROR = await verifyROR(ror),
  doi = "https://doi.org/10.1128/jmbe.00128-21",
  verifiedDOI = await verifyDOI(doi);

console.log(
  `ORCID ${normalizeORCID(orcid)} -> is valid? ${
    validateORCID(orcid)
  } -> verfied? ${verifiedORCID}`,
);
console.log(
  `ORCID ${normalizeROR(ror)} -> is valid? ${
    validateROR(ror)
  } -> verfied? ${verifiedROR}`,
);
console.log(
  `ORCID ${normalizeDOI(doi)} -> is valid? ${
    validateDOI(doi)
  } -> verfied? ${verifiedDOI}`,
);
```


# Example output

```shell
ORCID 0000-0003-0900-6903 -> is valid? true -> verfied? true
ORCID https://ror.org/00mpvse27 -> is valid? true -> verfied? true
ORCID 10.1128/jmbe.00128-21 -> is valid? true -> verfied? true
```

# Roadmap?

Metadata Tools is still at the early experimental stage.  Some ideas
for future directions include targetting WASM in additional to a native
binary for `mdt` cli. This would allow Metadata Tools to be used from
languages that can import and run WASM modules (e.g. Rust, Python and Go).

Add additional identifier support as needed. 

