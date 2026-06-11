package metadatatools

import (
	"regexp"
	"strings"
)

// LCNAFPattern matches a normalized Library of Congress Name Authority
// File identifier.
const LCNAFPattern = `^[a-zA-Z0-9]+$`

// reLCNAF is the compiled form of LCNAFPattern.
var reLCNAF = regexp.MustCompile(LCNAFPattern)

// NormalizeLCNAF trims whitespace from id.
func NormalizeLCNAF(id string) string {
	return strings.TrimSpace(id)
}

// ValidateLCNAF normalizes id then validates it against LCNAFPattern.
func ValidateLCNAF(id string) bool {
	return reLCNAF.MatchString(NormalizeLCNAF(id))
}
