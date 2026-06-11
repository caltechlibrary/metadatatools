package metadatatools

import (
	"net/url"
	"regexp"
	"strings"
)

// DOIPattern is the regular expression pattern matching a normalized DOI.
const DOIPattern = `^10\.\d{4,9}/[^\s]+$`

// reDOI is the compiled form of DOIPattern.
var reDOI = regexp.MustCompile(DOIPattern)

// NormalizeDOI normalizes a DOI by removing extraneous characters and
// enforcing lowercase.
//
// Example:
//
//	doi := NormalizeDOI("https://www.doi.org/10.22002/bv2pv-2b295")
//	// doi == "10.22002/bv2pv-2b295"
func NormalizeDOI(doi string) string {
	lowercaseDOI := strings.ToLower(strings.TrimSpace(doi))
	if u, err := url.Parse(lowercaseDOI); err == nil && u.Scheme != "" && u.Path != "" {
		return strings.TrimPrefix(u.Path, "/")
	}
	return lowercaseDOI
}

// ValidateDOI validates the format of a DOI.
func ValidateDOI(doi string) bool {
	normalized := NormalizeDOI(doi)
	return reDOI.MatchString(normalized)
}
