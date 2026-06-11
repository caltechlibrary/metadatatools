package metadatatools

import "testing"

func TestROR(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"https://ror.org/05dxps055",
		"https://ror.org/040ty4453",
		"https://ror.org/03taz7m60",
		"https://ror.org/05td03w87",
		"https://ror.org/024e4df17",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeROR(id)
		if normalized == "" {
			t.Errorf("NormalizeROR(%q) returned an empty string", id)
		}
		t.Logf("Normalized ROR: %s", normalized)

		if !ValidateROR(id) {
			t.Errorf("ValidateROR(%q) = false, expected true", id)
		}

		if !VerifyROR(id) {
			t.Errorf("VerifyROR(%q) = false, expected true", id)
		}
	}
}

func TestValidateCaltechROR(t *testing.T) {
	ror := "https://ror.org/05dxps055"
	if !ValidateROR(ror) {
		t.Errorf("ValidateROR(%q) = false, expected true (Caltech Library ROR)", ror)
	}
}
