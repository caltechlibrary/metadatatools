// mdtools is a command line tool for normalizing, validating and
// verifying scholarly and bibliographic identifiers (ArXiv, DOI, ISBN,
// ORCID, ROR, etc.).
//
// Author R. S. Doiel, <rsdoiel@library.caltech.edu>
//
// Copyright (c) 2025, Caltech
// All rights not granted herein are expressly reserved by Caltech.
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
package main

import (
	"flag"
	"fmt"
	"os"
	"path"
	"strings"

	// Caltech Library packages
	"github.com/caltechlibrary/metadatatools"
)

var (
	// Standard Options
	showHelp    bool
	showLicense bool
	showVersion bool
)

// action runs verb (normalize, validate or verify) against identifier
// using the provided normalize, validate and verify functions, printing
// the result to stdout. verify may be nil if verification is
// unavailable for the identifier type. It returns the process exit code.
func action(normalize metadatatools.NormalizorFunc, validate metadatatools.ValidatorFunc, verify metadatatools.VerifyFunc, verb string, identifier string) int {
	switch verb {
	case "normalize":
		fmt.Println(normalize(identifier))
	case "validate":
		if validate(identifier) {
			fmt.Println("true")
		} else {
			fmt.Println("false")
		}
	case "verify":
		if verify == nil {
			fmt.Println("undefined")
			return 3
		}
		if verify(identifier) {
			fmt.Println("true")
		} else {
			fmt.Println("false")
		}
	default:
		fmt.Printf("ERROR: %s action is not supported\n", verb)
		return 1
	}
	return 0
}

func main() {
	appName := path.Base(os.Args[0])
	helpText := metadatatools.MDToolsHelpText
	version, releaseDate, releaseHash := metadatatools.Version, metadatatools.ReleaseDate, metadatatools.ReleaseHash
	licenseText := metadatatools.LicenseText
	fmtHelp := metadatatools.FmtHelp

	flagSet := flag.NewFlagSet(appName, flag.ContinueOnError)

	// Standard Options
	flagSet.BoolVar(&showHelp, "help", false, "display help")
	flagSet.BoolVar(&showLicense, "license", false, "display license")
	flagSet.BoolVar(&showVersion, "version", false, "display version")

	flagSet.Parse(os.Args[1:])
	args := flagSet.Args()

	if showHelp {
		fmt.Fprint(os.Stdout, fmtHelp(helpText, appName, version, releaseDate, releaseHash))
		os.Exit(0)
	}
	if showLicense {
		fmt.Fprintf(os.Stdout, "%s\n", licenseText)
		os.Exit(0)
	}
	if showVersion {
		fmt.Fprintf(os.Stdout, "%s %s %s\n", appName, version, releaseHash)
		os.Exit(0)
	}

	if len(args) != 3 {
		fmt.Fprintf(os.Stderr, "Usage: %s normalize|validate|verify ID_TYPE IDENTIFIER\n", appName)
		os.Exit(1)
	}
	verb := strings.ToLower(strings.TrimSpace(args[0]))
	idType := strings.ToLower(strings.TrimSpace(args[1]))
	identifier := strings.ToLower(strings.TrimSpace(args[2]))

	var exitCode int
	switch idType {
	case "arxiv":
		exitCode = action(metadatatools.NormalizeArXivID, metadatatools.ValidateArXivID, metadatatools.VerifyArXivID, verb, identifier)
	case "doi":
		exitCode = action(metadatatools.NormalizeDOI, metadatatools.ValidateDOI, metadatatools.VerifyDOI, verb, identifier)
	case "ean":
		exitCode = action(metadatatools.NormalizeEAN, metadatatools.ValidateEAN, nil, verb, identifier)
	case "email":
		exitCode = action(metadatatools.NormalizeEMAIL, metadatatools.ValidateEMAIL, nil, verb, identifier)
	case "fundref":
		exitCode = action(metadatatools.NormalizeFundRefID, metadatatools.ValidateFundRefID, metadatatools.VerifyFundRefID, verb, identifier)
	case "isbn":
		exitCode = action(metadatatools.NormalizeISBN, metadatatools.ValidateISBN, metadatatools.VerifyISBN, verb, identifier)
	case "isni":
		exitCode = action(metadatatools.NormalizeISNI, metadatatools.ValidateISNI, metadatatools.VerifyISNI, verb, identifier)
	case "issn":
		exitCode = action(metadatatools.NormalizeISSN, metadatatools.ValidateISSN, metadatatools.VerifyISSN, verb, identifier)
	case "lcnaf":
		exitCode = action(metadatatools.NormalizeLCNAF, metadatatools.ValidateLCNAF, metadatatools.VerifyLCNAF, verb, identifier)
	case "orcid":
		exitCode = action(metadatatools.NormalizeORCID, metadatatools.ValidateORCID, metadatatools.VerifyORCID, verb, identifier)
	case "pmcid":
		exitCode = action(metadatatools.NormalizePMCID, metadatatools.ValidatePMCID, metadatatools.VerifyPMCID, verb, identifier)
	case "pmid":
		exitCode = action(metadatatools.NormalizePMID, metadatatools.ValidatePMID, metadatatools.VerifyPMID, verb, identifier)
	case "ror":
		exitCode = action(metadatatools.NormalizeROR, metadatatools.ValidateROR, metadatatools.VerifyROR, verb, identifier)
	case "snac":
		exitCode = action(metadatatools.NormalizeSNAC, metadatatools.ValidateSNAC, metadatatools.VerifySNAC, verb, identifier)
	case "tel":
		exitCode = action(metadatatools.NormalizeTEL, metadatatools.ValidateTEL, nil, verb, identifier)
	case "uuid":
		exitCode = action(metadatatools.NormalizeUUID, metadatatools.ValidateUUID, nil, verb, identifier)
	case "viaf":
		exitCode = action(metadatatools.NormalizeVIAF, metadatatools.ValidateVIAF, metadatatools.VerifyVIAF, verb, identifier)
	default:
		fmt.Printf("ERROR: %s type is not supported\n", idType)
		exitCode = 1
	}
	os.Exit(exitCode)
}
