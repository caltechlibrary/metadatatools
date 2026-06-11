package metadatatools

import "testing"

func TestPMCID(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"PMC11021482",
		"10557066",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizePMCID(id)
		if normalized == "" {
			t.Errorf("NormalizePMCID(%q) returned an empty string", id)
		}
		t.Logf("Normalized PMCID: %s", normalized)

		if !ValidatePMCID(id) {
			t.Errorf("ValidatePMCID(%q) = false, expected true", id)
		}

		if !VerifyPMCID(id) {
			t.Errorf("VerifyPMCID(%q) = false, expected true", id)
		}
	}
}
