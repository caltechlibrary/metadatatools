package metadatatools

import (
	"testing"
)

func TestNormalizeRAiD(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"10.26259/0e59e9a5", "https://raid.org/10.26259/0e59e9a5"},
		{"10.83962/fb5be317", "https://raid.org/10.83962/fb5be317"},
		{"https://raid.org/10.26259/0e59e9a5", "https://raid.org/10.26259/0e59e9a5"},
		{"https://raid.org/10.83962/f2a7645d", "https://raid.org/10.83962/f2a7645d"},
		{"  HTTPS://RAID.ORG/10.26259/0E59E9A5  ", "https://raid.org/10.26259/0e59e9a5"},
	}
	for _, test := range tests {
		got := NormalizeRAiD(test.input)
		if got != test.expected {
			t.Errorf("NormalizeRAiD(%q) = %q, expected %q", test.input, got, test.expected)
		}
	}
}

func TestNormalizeRAiDShort(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"10.26259/0e59e9a5", "10.26259/0e59e9a5"},
		{"10.83962/fb5be317", "10.83962/fb5be317"},
		{"https://raid.org/10.26259/0e59e9a5", "10.26259/0e59e9a5"},
		{"https://raid.org/10.83962/f2a7645d", "10.83962/f2a7645d"},
		{"  HTTPS://RAID.ORG/10.26259/0E59E9A5  ", "10.26259/0e59e9a5"},
	}
	for _, test := range tests {
		got := NormalizeRAiDShort(test.input)
		if got != test.expected {
			t.Errorf("NormalizeRAiDShort(%q) = %q, expected %q", test.input, got, test.expected)
		}
	}
}

func TestValidateRAiD(t *testing.T) {
	valid := []string{
		"10.26259/0e59e9a5",
		"10.83962/fb5be317",
		"https://raid.org/10.26259/0e59e9a5",
		"https://raid.org/10.83962/f2a7645d",
		"HTTPS://RAID.ORG/10.26259/0E59E9A5",
	}
	for _, id := range valid {
		if !ValidateRAiD(id) {
			t.Errorf("ValidateRAiD(%q) = false, expected true", id)
		}
		if !ValidateRAiDShort(id) {
			t.Errorf("ValidateRAiDShort(%q) = false, expected true", id)
		}
	}

	invalid := []string{
		"",
		"not-a-raid",
		"11.26259/0e59e9a5",  // does not start with 10
		"102.26259/0e59e9a5", // "102." is not a real RAiD prefix, see D8
	}
	for _, id := range invalid {
		if ValidateRAiD(id) {
			t.Errorf("ValidateRAiD(%q) = true, expected false", id)
		}
		if ValidateRAiDShort(id) {
			t.Errorf("ValidateRAiDShort(%q) = true, expected false", id)
		}
	}
}

// TestRAiDIsDOIShaped documents the relationship between DOI and RAiD
// identifiers: RAiDs are issued as DOIs via DataCite, so RAiD and DOI share
// the same "10.<4-9 digit registrant code>/<suffix>" format. There is no
// format-level way to distinguish a RAiD from a DOI - any valid RAiD is also
// a valid DOI, and vice versa. See dev-notes/decisions_RAiD_support.md D8.
func TestRAiDIsDOIShaped(t *testing.T) {
	shared := []string{"10.26259/0e59e9a5", "10.83962/fb5be317"}
	for _, id := range shared {
		if !ValidateDOI(id) {
			t.Errorf("ValidateDOI(%q) = false, expected true (RAiD is DOI-shaped)", id)
		}
		if !ValidateRAiD(id) {
			t.Errorf("ValidateRAiD(%q) = false, expected true (RAiD is DOI-shaped)", id)
		}
	}
}
