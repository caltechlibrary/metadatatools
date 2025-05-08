/**
 * this module provides help documentation and function for the cli
 * @module
 */

/**
 * this formats the help text replacing the curly bracket delimited application name,
 * version number, release date and release hash.
 * 
 * @param txt 
 * @param appName 
 * @param version 
 * @param releaseDate 
 * @param releaseHash 
 * @returns
 * 
 * @example
 * ```ts
 *   if (args.help) {
 *      console.log(fmtHelp(textText, appName, version, releaseDate, releaseHash));
 *      return; // exit after displaying help
 *   }
 * ```
 */
export function fmtHelp(
  txt: string,
  appName: string,
  version: string,
  releaseDate: string,
  releaseHash: string,
): string {
  return txt.replaceAll("{app_name}", appName).replaceAll("{version}", version)
    .replaceAll("{release_date}", releaseDate).replaceAll(
      "{release_hash}",
      releaseHash,
    );
}

// Markdown
export const helpText = `%{app_name}(1) user manual | {version} {release_date} {release_hash}
% R. S.Doiel
% {release_date} {release_hash}
    
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

{app_name} used to normalize, validate and verify an ORCID.

~~~shell
{app_name} normalize orcid 0000-0003-0900-6903
{app_name} validate orcid 0000-0003-0900-6903
{app_name} verify orcid 0000-0003-0900-6903
~~~
  
`;

