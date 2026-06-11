package metadatatools

import "testing"

func TestPMID(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"34125777",
		"PMID: 25591183",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizePMID(id)
		if normalized == "" {
			t.Errorf("NormalizePMID(%q) returned an empty string", id)
		}
		t.Logf("Normalized PMID: %s", normalized)

		if !ValidatePMID(id) {
			t.Errorf("ValidatePMID(%q) = false, expected true", id)
		}

		if !VerifyPMID(id) {
			t.Errorf("VerifyPMID(%q) = false, expected true", id)
		}
	}
}
