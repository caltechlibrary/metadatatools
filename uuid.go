package metadatatools

import (
	"regexp"
	"strings"
)

// reUUID matches a UUID in canonical 8-4-4-4-12 hexadecimal form with
// a version nibble of 1-8 and an RFC 4122 variant nibble, covering the
// v1, v3, v4, and v5 UUIDs supported by Deno's @std/uuid validate().
var reUUID = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`)

// NormalizeUUID lower cases uuid and removes any whitespace.
func NormalizeUUID(uuid string) string {
	return strings.Join(strings.Fields(strings.ToLower(uuid)), "")
}

// ValidateUUID normalizes uuid then validates its form.
func ValidateUUID(uuid string) bool {
	return reUUID.MatchString(NormalizeUUID(uuid))
}
