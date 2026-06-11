package metadatatools

import (
	"regexp"
	"strings"
)

// EMAILPattern is the regular expression pattern matching a normalized
// email address.
const EMAILPattern = `^(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)$`

// reEMAIL is the compiled form of EMAILPattern.
var reEMAIL = regexp.MustCompile(EMAILPattern)

// NormalizeEMAIL trims whitespace from email and removes any internal
// whitespace.
//
// Example:
//
//	email := NormalizeEMAIL("  jane.doe@example.edu ")
//	// email == "jane.doe@example.edu"
func NormalizeEMAIL(email string) string {
	return strings.Join(strings.Fields(email), "")
}

// ValidateEMAIL validates the form of email after normalizing it.
func ValidateEMAIL(email string) bool {
	return reEMAIL.MatchString(NormalizeEMAIL(email))
}
