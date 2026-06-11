%mdtools(1) user manual | version 0.1.1 5618538
% R. S. Doiel
% 2026-06-11

# NAME

mdtools

# SYNOPSIS

mdtools [OPTIONS] normalize|validate|verify ID_TYPE IDENTIFIER

# DESCRIPTION

mdtools will normalize, validate or verify the identifier provided
based on the type provided. Validate and verify it will return the text
'true' or 'false' and set an error level. Normalize will return the
normalized string.

NOTE: verify requires network access.

# ID_TYPE

The following identifier types are supported (type names are case insensitive).

- ArXiv
- DOI
- DOI-Short (bare 10.xxxx/yyyy form of DOI)
- EAN (verification unavailable)
- EMAIL (email address, verification unavailable)
- FUNDREF
- ISBN
- ISSN
- ISNI
- LCNAF
- ORCID
- PMID
- PMCID
- RAiD (verification unavailable)
- RAiD-Short (bare 10.xxxx/yyyy or 102.xxxx/yyyy form of RAiD, verification unavailable)
- ROR
- SNAC
- TEL (telephone number, verification unavailable)
- UUID (verification unavailable)
- VIAF

NOTE: for identifier types with unavailable verification they will return
the text "undefined" and exit code of 3.

# OPTIONS

-h, --help
: display help

-l, --license
: display license

-v, --version
: display version

# EXAMPLE

mdtools used to normalize, validate and verify an ORCID.

~~~shell
mdtools normalize orcid 0000-0003-0900-6903
mdtools validate orcid 0000-0003-0900-6903
mdtools verify orcid 0000-0003-0900-6903
~~~

