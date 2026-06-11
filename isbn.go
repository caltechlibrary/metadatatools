package metadatatools

import (
	"regexp"
	"strings"
)

// ISBN10Pattern matches an ISBN-10 with optional space or hyphen
// separators between digits.
const ISBN10Pattern = `^(?:\d[ |-]?){9}[\d|X]$`

// reISBN10 is the compiled, case-insensitive form of ISBN10Pattern.
var reISBN10 = regexp.MustCompile(`(?i)` + ISBN10Pattern)

// reISBNStrip matches any character that is not a digit or an X,
// leaving the bare digits (and possible ISBN-10 check character) of
// an ISBN.
var reISBNStrip = regexp.MustCompile(`(?i)[^0-9X]`)

// reHyphenOrSpace matches a hyphen or whitespace character.
var reHyphenOrSpace = regexp.MustCompile(`[-\s]`)

// validateISBN10 checks the Mod 11 checksum of a cleaned (digits with
// an optional trailing X), 10 character ISBN-10.
func validateISBN10(isbn string) bool {
	clean := reISBNStrip.ReplaceAllString(isbn, "")
	if len(clean) != 10 {
		return false
	}

	digits := digitsOf(clean[:9])
	sum := 0
	for i, d := range digits {
		sum += d * (10 - i)
	}

	checkDigit := 10
	if strings.ToUpper(clean[9:10]) != "X" {
		checkDigit = int(clean[9] - '0')
	}
	return (sum+checkDigit)%11 == 0
}

// validateISBN13 checks the Mod 10 checksum of a cleaned (digits only),
// 13 character ISBN-13.
func validateISBN13(isbn string) bool {
	clean := reNonDigit.ReplaceAllString(isbn, "")
	if len(clean) != 13 {
		return false
	}

	digits := digitsOf(clean)
	sum := 0
	for i, d := range digits {
		if i%2 == 0 {
			sum += d
		} else {
			sum += d * 3
		}
	}
	return sum%10 == 0
}

// ValidateISBN validates isbn as either an ISBN-10 or ISBN-13.
func ValidateISBN(isbn string) bool {
	clean := reISBNStrip.ReplaceAllString(isbn, "")
	switch len(clean) {
	case 10:
		return validateISBN10(clean)
	case 13:
		return validateISBN13(clean)
	}
	return false
}

// NormalizeISBN removes hyphens and whitespace from isbn and reformats
// 10 or 13 digit ISBNs with hyphens.
//
// Example:
//
//	isbn := NormalizeISBN("978-3-16-148410-0")
//	// isbn == "978-3-16-14841-00"
func NormalizeISBN(isbn string) string {
	bare := reHyphenOrSpace.ReplaceAllString(isbn, "")
	switch len(bare) {
	case 10:
		return joinGroups(bare, "-", 1, 3, 5)
	case 13:
		return joinGroups(bare, "-", 3, 1, 2, 5)
	}
	return bare
}
