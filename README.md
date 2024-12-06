
# metadatatools

This project was inspired by the [idutils](https://idutils.readthedocs.io/en/latest/) Python package.  This package is not a port of the Python idutils though. It is focused on the identifiers Caltech Library needs for the COLD project.

For each identifier support at least three types of methods are implemented

normalization
: this will return a valid identifier into a regularize format for validation and verification

validation
: this checks if the form of the identifier string makes sense, e.g. does it look like an ORCID is expected to look?

verification
: verification checks with the authoritive organization to see if data is available for the identifier. In most cases that means the organizations that supports creating and managing the identifier (e.g. orcid.org, isni.org, ror.org).

## Supported identifiers

- ArXiv ID
- DOI
- FundRef ID (depreciated, functionally replaced by ROR)
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


