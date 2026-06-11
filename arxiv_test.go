package metadatatools

import "testing"

func TestArXivID(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"arXiv:2412.03631",
		"arXiv:2412.03649",
		"arXiv:2412.04386",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeArXivID(id)
		if normalized == "" {
			t.Errorf("NormalizeArXivID(%q) returned an empty string", id)
		}
		t.Logf("Normalized arXiv ID: %s", normalized)

		if !ValidateArXivID(id) {
			t.Errorf("ValidateArXivID(%q) = false, expected true", id)
		}

		if !VerifyArXivID(id) {
			t.Errorf("VerifyArXivID(%q) = false, expected true", id)
		}
	}
}
