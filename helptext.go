package metadatatools

// MDToolsHelpText holds the man page style documentation for the
// mdtools command line program.
const MDToolsHelpText = `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] normalize|validate|verify ID_TYPE IDENTIFIER

# DESCRIPTION

{app_name} will normalize, validate or verify the identifier provided
based on the type provided. Validate and verify it will return the text
'true' or 'false' and set an error level. Normalize will return the
normalized string.

NOTE: verify requires network access.

# ID_TYPE

The following identifier types are supported (type names are case insensitive).

- ArXiv
- DOI
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

{app_name} used to normalize, validate and verify an ORCID.

~~~shell
{app_name} normalize orcid 0000-0003-0900-6903
{app_name} validate orcid 0000-0003-0900-6903
{app_name} verify orcid 0000-0003-0900-6903
~~~

`
