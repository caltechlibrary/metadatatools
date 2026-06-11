package metadatatools

import (
	"net/url"
	"regexp"
	"strings"
)

// RAiDPrefix is the canonical resolver URL prefix for a RAiD.
const RAiDPrefix = "https://raid.org/"

// RAiDPattern is the regular expression pattern matching a normalized
// (extended/full URL) RAiD.
const RAiDPattern = `^https://raid\.org/102?\.\d+/[^\s]+$`

// reRAiD is the compiled form of RAiDPattern.
var reRAiD = regexp.MustCompile(RAiDPattern)

// RAiDShortPattern is the regular expression pattern matching a normalized
// short-form (bare) RAiD.
const RAiDShortPattern = `^102?\.\d+/[^\s]+$`

// reRAiDShort is the compiled form of RAiDShortPattern.
var reRAiDShort = regexp.MustCompile(RAiDShortPattern)

// NormalizeRAiDShort normalizes a RAiD to its short form by removing
// extraneous characters and enforcing lowercase.
//
// Example:
//
//	raid := NormalizeRAiDShort("https://raid.org/10.26259/0e59e9a5")
//	// raid == "10.26259/0e59e9a5"
func NormalizeRAiDShort(raid string) string {
	lowercaseRAiD := strings.ToLower(strings.TrimSpace(raid))
	if u, err := url.Parse(lowercaseRAiD); err == nil && u.Scheme != "" && u.Path != "" {
		return strings.TrimPrefix(u.Path, "/")
	}
	return lowercaseRAiD
}

// NormalizeRAiD normalizes a RAiD to its extended (full URL) form.
//
// Example:
//
//	raid := NormalizeRAiD("10.26259/0e59e9a5")
//	// raid == "https://raid.org/10.26259/0e59e9a5"
func NormalizeRAiD(raid string) string {
	return RAiDPrefix + NormalizeRAiDShort(raid)
}

// ValidateRAiD validates the extended (full URL) form of a RAiD.
func ValidateRAiD(raid string) bool {
	return reRAiD.MatchString(NormalizeRAiD(raid))
}

// ValidateRAiDShort validates the short (bare) form of a RAiD.
func ValidateRAiDShort(raid string) bool {
	return reRAiDShort.MatchString(NormalizeRAiDShort(raid))
}
