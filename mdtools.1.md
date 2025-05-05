%mdtools(1) user manual | 0.0.6 2025-05-05 50a64de
% R. S.Doiel
% 2025-05-05 50a64de
    
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

The following identifier types are supported (type name are case insensitive).

- ArXiv
- DOI
- EMAIL (email address, verification unavailable)
- ISBN
- ISSN
- ISNI
- LCNAF
- ORCID
- PMID
- PMCID
- ROR
- SNAC
- TEL (telphone number, verification unavailable)
- UUID (NOTE: verification unavailable)
- VIAF

NOTE: for identifier types with unavailable varification they will return
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
  

