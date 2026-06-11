package metadatatools

import "strconv"

// stripISSN removes any non-digit characters from issn.
func stripISSN(issn string) string {
	return reNonDigit.ReplaceAllString(issn, "")
}

// validateISSNChecksum validates the Mod 11 checksum digit of a
// normalized, 8 digit ISSN.
func validateISSNChecksum(issn string) bool {
	if len(issn) != 8 {
		return false
	}

	digits := digitsOf(issn[:7])
	sum := 0
	for i, d := range digits {
		sum += d * (8 - i)
	}
	checksum := sum % 11

	var expected string
	switch checksum {
	case 0:
		expected = "0"
	case 1:
		expected = "X"
	default:
		expected = strconv.Itoa(11 - checksum)
	}
	return issn[7:8] == expected
}

// ValidateISSN normalizes issn then validates its checksum digit.
func ValidateISSN(issn string) bool {
	return validateISSNChecksum(stripISSN(issn))
}

// NormalizeISSN removes any non-digit characters from issn and
// reformats it as NNNN-NNNN.
//
// Example:
//
//	issn := NormalizeISSN("1058-6180")
//	// issn == "1058-6180"
func NormalizeISSN(issn string) string {
	return joinGroups(stripISSN(issn), "-", 4)
}
