package metadatatools

import (
	"regexp"
	"strings"
)

// reISNI16Digits matches a normalized, 16 digit ISNI.
var reISNI16Digits = regexp.MustCompile(`^\d{16}$`)

// stripISNI upper cases isni and removes whitespace and hyphens.
func stripISNI(isni string) string {
	s := reWhitespace.ReplaceAllString(strings.ToUpper(isni), "")
	return strings.ReplaceAll(s, "-", "")
}

// NormalizeISNI removes whitespace and hyphens from isni and reformats
// it as four space-separated groups of four digits.
func NormalizeISNI(isni string) string {
	return joinGroups(stripISNI(isni), " ", 4, 4, 4)
}

// validateISNIChecksum validates the ISO 7064 Mod 11-2 checksum digit
// of a normalized, 16 digit ISNI.
func validateISNIChecksum(isni string) bool {
	bare := stripISNI(isni)
	digits := digitsOf(bare)

	sum := 0
	for i := 0; i < 15; i++ {
		sum = (sum + digits[i]) * 2 % 11
	}
	calculated := (12 - sum%11) % 11
	if calculated == 10 {
		return bare[15] == 'X'
	}
	return digits[15] == calculated
}

// ValidateISNI validates the form and checksum of isni.
func ValidateISNI(isni string) bool {
	bare := stripISNI(isni)
	if !reISNI16Digits.MatchString(bare) {
		return false
	}
	return validateISNIChecksum(bare)
}
