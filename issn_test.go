package metadatatools

import "testing"

func TestISSN(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"1058-6180",
		"1934-1547",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeISSN(id)
		if normalized == "" {
			t.Errorf("NormalizeISSN(%q) returned an empty string", id)
		}
		t.Logf("Normalized ISSN: %s", normalized)

		if !ValidateISSN(id) {
			t.Errorf("ValidateISSN(%q) = false, expected true", id)
		}

		if !VerifyISSN(id) {
			t.Errorf("VerifyISSN(%q) = false, expected true", id)
		}
	}
}
