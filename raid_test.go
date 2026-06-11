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
		{"102.26259/0e59e9a5", "https://raid.org/102.26259/0e59e9a5"},
		{"https://raid.org/10.26259/0e59e9a5", "https://raid.org/10.26259/0e59e9a5"},
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
		{"102.26259/0e59e9a5", "102.26259/0e59e9a5"},
		{"https://raid.org/10.26259/0e59e9a5", "10.26259/0e59e9a5"},
		{"https://raid.org/102.26259/0e59e9a5", "102.26259/0e59e9a5"},
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
		"102.26259/0e59e9a5",
		"https://raid.org/10.26259/0e59e9a5",
		"https://raid.org/102.26259/0e59e9a5",
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
		"11.26259/0e59e9a5", // does not start with 10 or 102
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

// TestDOIRAiDDisambiguation documents the relationship between DOI and RAiD
// identifiers: RAiD reuses DOI's "10.xxxx/yyyy" identifier space (RAiDs are
// issued as DOIs via DataCite), so a bare "10.xxxx/yyyy" is valid as both a
// DOI and a RAiD. The "102.xxxx/yyyy" form is RAiD-exclusive, since DOI
// requires a literal "10." prefix.
func TestDOIRAiDDisambiguation(t *testing.T) {
	shared := "10.26259/0e59e9a5"
	if !ValidateDOI(shared) {
		t.Errorf("ValidateDOI(%q) = false, expected true (shared identifier space)", shared)
	}
	if !ValidateRAiD(shared) {
		t.Errorf("ValidateRAiD(%q) = false, expected true (shared identifier space)", shared)
	}

	raidOnly := "102.26259/0e59e9a5"
	if ValidateDOI(raidOnly) {
		t.Errorf("ValidateDOI(%q) = true, expected false (102. prefix is RAiD-exclusive)", raidOnly)
	}
	if !ValidateRAiD(raidOnly) {
		t.Errorf("ValidateRAiD(%q) = false, expected true (102. prefix is RAiD-exclusive)", raidOnly)
	}
}
