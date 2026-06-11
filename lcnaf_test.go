package metadatatools

import "testing"

func TestLCNAF(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"n81044376",
		"no2023032145",
		"no2022139137",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeLCNAF(id)
		if normalized == "" {
			t.Errorf("NormalizeLCNAF(%q) returned an empty string", id)
		}
		t.Logf("Normalized LCNAF ID: %s", normalized)

		if !ValidateLCNAF(id) {
			t.Errorf("ValidateLCNAF(%q) = false, expected true", id)
		}

		if !VerifyLCNAF(id) {
			t.Errorf("VerifyLCNAF(%q) = false, expected true", id)
		}
	}
}
