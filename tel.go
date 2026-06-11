package metadatatools

import (
	"regexp"
	"strings"
)

// TELPattern is a permissive regular expression pattern for telephone
// numbers in a variety of common formats.
const TELPattern = `^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$`

// reTEL is the compiled form of TELPattern.
var reTEL = regexp.MustCompile(TELPattern)

// stripTEL trims whitespace from tel and removes any remaining
// non-digit characters.
func stripTEL(tel string) string {
	return reNonDigit.ReplaceAllString(strings.TrimSpace(tel), "")
}

// NormalizeTEL formats tel based on the number of digits it contains.
// If the digit count does not match a recognized length, tel is
// returned unchanged.
func NormalizeTEL(tel string) string {
	bare := stripTEL(tel)
	switch len(bare) {
	case 7:
		return bare[0:3] + "-" + bare[3:]
	case 10:
		return "(" + bare[0:3] + ") " + bare[3:6] + "-" + bare[6:]
	case 11:
		return "+00" + bare[0:1] + " (" + bare[1:4] + ") " + bare[4:7] + "-" + bare[7:]
	case 12:
		return "+0" + bare[0:2] + " (" + bare[2:5] + ") " + bare[5:8] + "-" + bare[8:]
	case 13:
		return "+" + bare[0:3] + " (" + bare[3:6] + ") " + bare[6:9] + "-" + bare[9:]
	default:
		return tel
	}
}

// ValidateTEL validates tel against TELPattern.
func ValidateTEL(tel string) bool {
	return reTEL.MatchString(tel)
}
