package metadatatools

import (
	"testing"
)

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
