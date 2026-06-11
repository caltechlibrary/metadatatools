package metadatatools

import (
	"net/url"
	"regexp"
	"strings"
)

// ORCIDPattern matches a normalized ORCID iD.
const ORCIDPattern = `^(\d{4}-\d{4}-\d{4}-\d{3}[\dX])$`

// reORCID is the compiled form of ORCIDPattern.
var reORCID = regexp.MustCompile(ORCIDPattern)

// stripORCID upper cases orcid and removes whitespace and hyphens.
func stripORCID(orcid string) string {
	s := reWhitespace.ReplaceAllString(strings.ToUpper(orcid), "")
	return strings.ReplaceAll(s, "-", "")
}

// NormalizeORCID strips whitespace, hyphens, and any
// "https://orcid.org/" prefix from orcid, then formats the remaining
// 16 characters as four hyphen-separated groups of four.
func NormalizeORCID(orcid string) string {
	bare := stripORCID(orcid)
	if u, err := url.Parse(bare); err == nil && u.Scheme != "" && u.Path != "" {
		bare = strings.TrimPrefix(u.Path, "/")
	}
	return joinGroups(bare, "-", 4, 4, 4)
}

// ValidateORCID normalizes orcid, checks its form against ORCIDPattern,
// and verifies its ISO 7064 Mod 11-2 checksum digit.
func ValidateORCID(orcid string) bool {
	normalized := NormalizeORCID(orcid)
	if !reORCID.MatchString(normalized) {
		return false
	}
	bare := stripORCID(normalized)
	if len(bare) != 16 {
		return false
	}

	checksum := 10
	if bare[15] != 'X' {
		checksum = int(bare[15] - '0')
	}

	total := 0
	for _, d := range digitsOf(bare[:15]) {
		total = (total + d) * 2
	}
	calculated := (12 - total%11) % 11
	return calculated == checksum
}
