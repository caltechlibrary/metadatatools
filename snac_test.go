package metadatatools

import "testing"

func TestSNAC(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"108127625",
		"101062721",
		"14957683",
		"117619223",
		"53323307",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeSNAC(id)
		if normalized == "" {
			t.Errorf("NormalizeSNAC(%q) returned an empty string", id)
		}
		t.Logf("Normalized SNAC ID: %s", normalized)

		if !ValidateSNAC(id) {
			t.Errorf("ValidateSNAC(%q) = false, expected true", id)
		}

		if !VerifySNAC(id) {
			t.Errorf("VerifySNAC(%q) = false, expected true", id)
		}
	}
}
