package metadatatools

import "testing"

func TestISNI(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"0000 0001 2096 0218",
		"0000 0000 8405 6132",
		"0000 0000 7182 7209",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeISNI(id)
		if normalized == "" {
			t.Errorf("NormalizeISNI(%q) returned an empty string", id)
		}
		t.Logf("Normalized ISNI: %s", normalized)

		if !ValidateISNI(id) {
			t.Errorf("ValidateISNI(%q) = false, expected true", id)
		}

		if !VerifyISNI(id) {
			t.Errorf("VerifyISNI(%q) = false, expected true", id)
		}
	}
}
