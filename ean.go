package metadatatools

import "strings"

// NormalizeEAN trims whitespace from ean and removes any non-digit
// characters.
//
// Example:
//
//	ean := NormalizeEAN("9780201544282")
//	// ean == "9780201544282"
func NormalizeEAN(ean string) string {
	return reNonDigit.ReplaceAllString(strings.TrimSpace(ean), "")
}

// validateEAN13 checks the checksum digit of a normalized 13 digit EAN.
func validateEAN13(ean string) bool {
	digits := digitsOf(ean)
	total := 0
	for i := 0; i < 12; i++ {
		if i%2 == 0 {
			total += digits[i]
		} else {
			total += digits[i] * 3
		}
	}
	checkDigit := (10 - (total % 10)) % 10
	return checkDigit == digits[12]
}

// validateEAN8 checks the checksum digit of a normalized 8 digit EAN.
func validateEAN8(ean string) bool {
	digits := digitsOf(ean)
	total := 0
	for i := 0; i < 7; i++ {
		if i%2 == 0 {
			total += digits[i] * 3
		} else {
			total += digits[i]
		}
	}
	checkDigit := (10 - (total % 10)) % 10
	return checkDigit == digits[7]
}

// ValidateEAN validates an EAN (International Article Number, European
// Article Number, Japanese Article Number) in either its 13 digit or
// 8 digit form.
func ValidateEAN(ean string) bool {
	normalized := NormalizeEAN(ean)
	switch len(normalized) {
	case 13:
		return validateEAN13(normalized)
	case 8:
		return validateEAN8(normalized)
	}
	return false
}
