# Metadata Tools

This project was inspired by the
[idutils](https://idutils.readthedocs.io/en/latest/) Python package. **This
package is not a port of the Python idutils**. This project focuses on the
identifiers Caltech Library needs for the
[COLD](https://github.com/caltechlibrary/cold) project.

For each supported identifier three types of methods are implemented.

normalization : this will return a valid identifier into a regularize format for
validation and verification

validation : this checks if the form of the identifier string makes sense, e.g.
does it look like an ORCID is expected to look?

verification : verification checks with the authoritative organization to see if
data is available for the identifier. In most cases that means the organizations
that supports creating and managing the identifier (e.g. orcid.org, isni.org,
ror.org).

## Supported identifiers

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

# USAGE

There are three ways to use Metadata Tools. The first is via the command line
program `mdtools`. This simple command line program accepts three parameters,
ACTION, ID_TYPE and IDENTIFIER. See [man page for details](mdtools.1.md). An ACTION
can be one of three things, "normalize", "validate" and "verify". The second
parameter is one of the types listed above. The final parameter the identifier
value. "normalize" will accept an identifier in a common format variation and
return a consisantly formated result. E.g. The ORCID
"https://orcid.org/0000-0003-0900-6903" will be normalize to
"0000-0003-0900-6903" where as an ROR of "05dxps055" will normalize to
"https://ror.org/05dxps055". The normalization appplied reflects the typical way
we handle the idenfier formatting in Caltech Library's repository systems.

"validate" will check of the identifier matches and expected form. E.g. An order
looks like four digits dash four digits dash four digits dash for digits. There
is some check summing also applied to validate the sequence (like with ISNI).
Validate will make sure the supplied identifier confirms to those types of
rules. It **does not verify** the value with the originating organization.

"verify" will validate the identifier supplied then check via a web service if
the identifier is known to the sponsoring organization or authority control. As
a result it requires network access and will fail if the sponsoring
organization's website or service is unavailable.

Both "validate" and "verfiy" return booleaning true if everything checks out and
false otherwise. The command line program `mtd` will also return a non-zero exit
code if the validation or verification fails.

The second way Metadata Tools can be use is as a
[ESM](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_%E2%80%93_ECMAScript_2015 "ECMAScript Module")
TypeScript module. The TypeScript module you can use from
[Deno](https://deno.com). The latest version of the Metadata Tools module can be
found at <https://github.com/caltechlibrary/metadatatools/latest/release> and on
the Caltech Library development group's GitHub website,
<https://caltechlibrary.github.io/metadatatools/mod.ts>. The `mod.ts` file will
pull in the whole set of identifier normalization, validation and verification
routines.

## Installation

The command line program can be installed using installer scripts hosted at
<https://caltechlibrary.github.io/metadatatools>. See [INSTALL.md](INSTALL.md)
for details.

While Metadata Tools should be considered experimental binaries are being
provided for macOS (x86_64 and M series processes), Windows 11 running on x86_64
processors and for Linux on x86_64 and aarch64 processesor.

## License

See [LICENSE](./LICENSE) for license details.
