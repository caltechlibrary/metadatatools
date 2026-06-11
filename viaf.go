package metadatatools

import (
	"regexp"
	"strings"
)

// VIAFPattern matches a normalized VIAF identifier, which is numeric.
const VIAFPattern = `^\d+$`

// reVIAF is the compiled form of VIAFPattern.
var reVIAF = regexp.MustCompile(VIAFPattern)

// NormalizeVIAF trims whitespace from id.
func NormalizeVIAF(id string) string {
	return strings.TrimSpace(id)
}

// ValidateVIAF normalizes id then validates it against VIAFPattern.
func ValidateVIAF(id string) bool {
	return reVIAF.MatchString(NormalizeVIAF(id))
}
