%mtd(1) user manual | 0.0.4 2024-12-11 d5af0f5
% R. S.Doiel
% 2024-12-11 d5af0f5
    
# NAME
    
mtd
    
# SYNOPSIS
    
mtd [OPTIONS] normalize|validate|verify ID_TYPE IDENTIFIER
    
# DESCRIPTION
    
mtd will normalize, validate or verify the identifier provided
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

help
  : display help

license
  : display license

version
  : display version


# EXAMPLE

mtd used to normalize, validate and verify an ORCID.

~~~shell
mtd normalize orcid 0000-0003-0900-6903
mtd validate orcid 0000-0003-0900-6903
mtd verify orcid 0000-0003-0900-6903
~~~
  

