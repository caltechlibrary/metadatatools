package metadatatools

import (
	"testing"
)

func TestNormalizeDOI(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"10.22002/bv2pv-2b295", "https://doi.org/10.22002/bv2pv-2b295"},
		{"https://doi.org/10.22002/bv2pv-2b295", "https://doi.org/10.22002/bv2pv-2b295"},
		{"  HTTPS://DOI.ORG/10.22002/BV2PV-2B295  ", "https://doi.org/10.22002/bv2pv-2b295"},
	}
	for _, test := range tests {
		got := NormalizeDOI(test.input)
		if got != test.expected {
			t.Errorf("NormalizeDOI(%q) = %q, expected %q", test.input, got, test.expected)
		}
	}
}

func TestNormalizeDOIShort(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"10.22002/bv2pv-2b295", "10.22002/bv2pv-2b295"},
		{"https://doi.org/10.22002/bv2pv-2b295", "10.22002/bv2pv-2b295"},
		{"  HTTPS://DOI.ORG/10.22002/BV2PV-2B295  ", "10.22002/bv2pv-2b295"},
	}
	for _, test := range tests {
		got := NormalizeDOIShort(test.input)
		if got != test.expected {
			t.Errorf("NormalizeDOIShort(%q) = %q, expected %q", test.input, got, test.expected)
		}
	}
}

func TestValidateDOI(t *testing.T) {
	valid := []string{
		"10.22002/bv2pv-2b295",
		"https://doi.org/10.22002/bv2pv-2b295",
		"HTTPS://DOI.ORG/10.22002/BV2PV-2B295",
	}
	for _, id := range valid {
		if !ValidateDOI(id) {
			t.Errorf("ValidateDOI(%q) = false, expected true", id)
		}
		if !ValidateDOIShort(id) {
			t.Errorf("ValidateDOIShort(%q) = false, expected true", id)
		}
	}

	invalid := []string{
		"",
		"not-a-doi",
		"10.123/abc", // registrant code too short, DOIPattern requires 4-9 digits
	}
	for _, id := range invalid {
		if ValidateDOI(id) {
			t.Errorf("ValidateDOI(%q) = true, expected false", id)
		}
		if ValidateDOIShort(id) {
			t.Errorf("ValidateDOIShort(%q) = true, expected false", id)
		}
	}
}

func TestDOI(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		// "10.1000/xyz123",
		"10.22002/bv2pv-2b295",
		"https://doi.org/10.22002/1gffr-va537",
		"https://doi.org/10.22002/0c391-eeh07",
	}

	for _, id := range verifiedIDs {
		// Normalize
		normalized := NormalizeDOI(id)
		if normalized == "" {
			t.Errorf("NormalizeDOI(%q) returned an empty string", id)
		}
		if !reDOI.MatchString(normalized) {
			t.Errorf("NormalizeDOI(%q) = %q, does not match DOIPattern", id, normalized)
		}
		t.Logf("Normalized DOI: %s", normalized)

		// Validate
		if !ValidateDOI(id) {
			t.Errorf("ValidateDOI(%q) = false, expected true", id)
		}

		// Verify
		if !VerifyDOI(id) {
			t.Errorf("VerifyDOI(%q) = false, expected true", id)
		}
		if obj, ok := GetObjectDOI(id); !ok || obj == nil {
			t.Errorf("GetObjectDOI(%q) = (%v, %v), expected an object and true", id, obj, ok)
		}
	}
}
