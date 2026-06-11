package metadatatools

import "testing"

func TestORCID(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"https://orcid.org/0000-0003-0900-6903",
		"0000-0002-6539-638X",
		"0000-0001-9266-5146",
		"0000-0002-0026-2516",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeORCID(id)
		if normalized == "" {
			t.Errorf("NormalizeORCID(%q) returned an empty string", id)
		}
		t.Logf("Normalized ORCID: %s", normalized)

		if !ValidateORCID(id) {
			t.Errorf("ValidateORCID(%q) = false, expected true", id)
		}

		if !VerifyORCID(id) {
			t.Errorf("VerifyORCID(%q) = false, expected true", id)
		}
	}
}
