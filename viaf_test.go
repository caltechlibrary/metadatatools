package metadatatools

import "testing"

func TestVIAF(t *testing.T) {
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
		normalized := NormalizeVIAF(id)
		if normalized == "" {
			t.Errorf("NormalizeVIAF(%q) returned an empty string", id)
		}
		t.Logf("Normalized VIAF ID: %s", normalized)

		if !ValidateVIAF(id) {
			t.Errorf("ValidateVIAF(%q) = false, expected true", id)
		}

		if !VerifyVIAF(id) {
			t.Errorf("VerifyVIAF(%q) = false, expected true", id)
		}
	}
}
