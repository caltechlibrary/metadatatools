# Metadata Tools Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Change Log](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-06-11

### Fixed
- Fixed bug in RAiD implementation caused by incorrectly including support for `102.*` prefixes which are not actually supported
- Fixed RAiD identifier support in general

### Changed
- Updated version information across documentation files (about.html, installer scripts, man page, version files)

## [0.1.0] - 2026-06-11

### Added
- **RAiD support**: Added complete support for Research Activity Identifier (RAiD) including normalization, validation, and verification
- **Go port**: Integrated a complete Go port of the TypeScript package
- **Go CLI**: The `mdtools` command line interface is now based on Go source code instead of Deno+TypeScript

### Changed
- **Breaking Change**: The CLI is now Go-based rather than TypeScript/Deno-based. This introduces breaking changes from the 0.0 series
- Updated CITATION.cff with new version information
- Updated installation documentation (INSTALL.html, installer scripts)
- Updated README.md to reflect the new Go-based implementation
- Updated man page (mdtools.1.md) for the new Go-based CLI
- Updated build system and Makefile for Go compilation
- Updated code metadata and project configuration

### Removed
- Removed Deno+TypeScript as the primary implementation (archived TypeScript files remain for reference)
- Removed `cmd/mdtools.ts` (replaced with `cmd/mdtools/main.go`)
- Removed `deps.ts` (TypeScript dependencies no longer needed for CLI)

### Documentation
- Added development decision documents for RAiD support
- Added implementation notes for RAiD support
- Updated documentation to reflect Go-based architecture

## [0.0.6] - 2025-05-05

### Changed
- **Breaking Change**: Renamed demo program from `mdt` to `mdtools` to avoid conflict with another program called `mdt`
- Fixed missing install/uninstall rules in Makefile
- Updated to use cmt-generated INSTALL.md
- Updated CITATION.cff
- Updated about.html and about.md

### Added
- First release published via GitHub
- Pagefind search index files added

## [0.0.5] - 2025-05-05

### Added
- Proof of concept implementation
- Improved test coverage across all identifier types
- Support for Deno 2.3

### Changed
- Updated CITATION.cff
- Updated documentation (about.html, about.md)
- Updated codemeta.json with current project metadata
- Updated installer scripts for better cross-platform support
- Updated man page (mdt.1.md)
- Updated pagefind search indexes

## [0.0.4] - 2024-12-11

### Added
- Initial proof of concept release
- Basic identifier types implemented as ESM module

### Changed
- Code cleanup and normalization
- Organized ancillary docs and scripts into their own folder

## [0.0.3] - 2024-12-11

### Added
- Preparation for initial proof of concept
- Core identifier support (DOI, ISBN, ISSN, ISNI, ORCID, PMID, PMCID, ROR, etc.)

## [0.0.2] - 2024-12-06

### Added
- Added remaining identifiers needed by COLD project
- Added ROR (Research Organization Registry) support
- Added codemeta.json file for project metadata
- Got ORCID support working

## [0.0.1] - 2024-12-05

### Added
- Initial setup for working proof of concept
- Basic identifier types implemented
- Project structure established
- Initial TypeScript ESM module implementation

## Project Origins

This project was inspired by the [idutils](https://idutils.readthedocs.io/en/latest/) Python package. It was created to provide identifier normalization, validation, and verification specifically for the identifiers Caltech Library needs for the [COLD](https://github.com/caltechlibrary/cold) project.

The project initially started as a TypeScript/Deno ESM module and was later ported to Go for better performance and distribution capabilities, with the CLI now being Go-based while maintaining the TypeScript module for library usage.

[Unreleased]: https://github.com/caltechlibrary/metadatatools/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/caltechlibrary/metadatatools/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.6...v0.1.0
[0.0.6]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/caltechlibrary/metadatatools/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/caltechlibrary/metadatatools/releases/tag/v0.0.1