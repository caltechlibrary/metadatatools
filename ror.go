package metadatatools

import (
	"regexp"
	"strings"
)

// RORPrefix is the canonical URL prefix for a ROR identifier.
const RORPrefix = "https://ror.org/"

// RORPattern matches a normalized ROR identifier, either as a full
// https://ror.org/ URL or as a bare ROR ID.
const RORPattern = `^https://ror\.org/0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$|^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$`

// reROR is the compiled, case-insensitive form of RORPattern.
var reROR = regexp.MustCompile(`(?i)` + RORPattern)

// NormalizeROR trims whitespace from ror, lower cases it, and ensures
// it has the RORPrefix.
func NormalizeROR(ror string) string {
	bare := strings.ToLower(strings.TrimSpace(ror))
	if strings.HasPrefix(bare, RORPrefix) {
		return bare
	}
	return RORPrefix + bare
}

// ValidateROR normalizes ror then validates it against RORPattern.
func ValidateROR(ror string) bool {
	return reROR.MatchString(NormalizeROR(ror))
}
