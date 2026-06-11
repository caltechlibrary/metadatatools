package metadatatools

import (
	"regexp"
	"strings"
)

// fundRefPattern matches a normalized FundRef DOI issued by CrossRef.
const fundRefPattern = `^10\.\d{4,9}/[-._;()/:A-Z0-9]+$`

// reFundRef is the compiled, case-insensitive form of fundRefPattern.
var reFundRef = regexp.MustCompile(`(?i)` + fundRefPattern)

// NormalizeFundRefID trims whitespace from id and lower cases it.
//
// Example:
//
//	id := NormalizeFundRefID("10.13039/100000001")
//	// id == "10.13039/100000001"
func NormalizeFundRefID(id string) string {
	return strings.ToLower(strings.TrimSpace(id))
}

// ValidateFundRefID normalizes id then validates it against fundRefPattern.
func ValidateFundRefID(id string) bool {
	return reFundRef.MatchString(NormalizeFundRefID(id))
}
