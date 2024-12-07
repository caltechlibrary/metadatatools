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
#updateDate: 2024-11-06
draft: true
#pubDate: 2024-11-15
place: Caltech
#date: November 15, 2024
section-titles: false
toc: true
keywords: [ "metadata", "identifiers", "normalizaiton", "validation", "verification", "TypeScript", "Deno" ]
url: "https://caltechlibrary.github.io/metadatatools"
---

# What is the Metadata Tools Project?

- An ESM (ECMAScript Module) for working with identifiers used by libraries and archives

# Why create the Metadata Tools Project?

If you working in Python you can use [idutils](https://idutils.readthedocs.io/). The problem is it is only for Python.  I needed a similar capability I can use server side (via Deno) and browser side (via transpiled JavaScript). I can even
use a WASM compiled version of Metadata Tools in other languages, even in Python!

Metadata Tools seeks to be very portable to the langauge or environment you need to use it in.

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


