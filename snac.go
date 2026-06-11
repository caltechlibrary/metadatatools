package metadatatools

import (
	"regexp"
	"strings"
)

// SNACPattern matches a normalized SNAC identifier, which is numeric.
const SNACPattern = `^\d+$`

// reSNAC is the compiled form of SNACPattern.
var reSNAC = regexp.MustCompile(SNACPattern)

// NormalizeSNAC trims whitespace from id.
func NormalizeSNAC(id string) string {
	return strings.TrimSpace(id)
}

// ValidateSNAC normalizes id then validates it against SNACPattern.
func ValidateSNAC(id string) bool {
	return reSNAC.MatchString(NormalizeSNAC(id))
}
