package metadatatools

import (
	"net/url"
	"regexp"
	"strings"
)

// DOIPrefix is the canonical resolver URL prefix for a DOI.
const DOIPrefix = "https://doi.org/"

// DOIPattern is the regular expression pattern matching a normalized
// (extended/full URL) DOI.
const DOIPattern = `^https://doi\.org/10\.\d{4,9}/[^\s]+$`

// reDOI is the compiled form of DOIPattern.
var reDOI = regexp.MustCompile(DOIPattern)

// DOIShortPattern is the regular expression pattern matching a normalized
// short-form (bare) DOI.
const DOIShortPattern = `^10\.\d{4,9}/[^\s]+$`

// reDOIShort is the compiled form of DOIShortPattern.
var reDOIShort = regexp.MustCompile(DOIShortPattern)

// NormalizeDOIShort normalizes a DOI to its short form by removing
// extraneous characters and enforcing lowercase.
//
// Example:
//
//	doi := NormalizeDOIShort("https://www.doi.org/10.22002/bv2pv-2b295")
//	// doi == "10.22002/bv2pv-2b295"
func NormalizeDOIShort(doi string) string {
	lowercaseDOI := strings.ToLower(strings.TrimSpace(doi))
	if u, err := url.Parse(lowercaseDOI); err == nil && u.Scheme != "" && u.Path != "" {
		return strings.TrimPrefix(u.Path, "/")
	}
	return lowercaseDOI
}

// NormalizeDOI normalizes a DOI to its extended (full URL) form.
//
// Example:
//
//	doi := NormalizeDOI("10.22002/bv2pv-2b295")
//	// doi == "https://doi.org/10.22002/bv2pv-2b295"
func NormalizeDOI(doi string) string {
	return DOIPrefix + NormalizeDOIShort(doi)
}

// ValidateDOI validates the extended (full URL) form of a DOI.
func ValidateDOI(doi string) bool {
	return reDOI.MatchString(NormalizeDOI(doi))
}

// ValidateDOIShort validates the short (bare) form of a DOI.
func ValidateDOIShort(doi string) bool {
	return reDOIShort.MatchString(NormalizeDOIShort(doi))
}
