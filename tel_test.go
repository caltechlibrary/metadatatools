package metadatatools

import "testing"

func TestTEL(t *testing.T) {
	verifiedIDs := []string{
		"111-2222",
		"111-222-3333",
		"1-222-333-4444",
		"11-222-333-4444",
		"111-222-333-4444",
	}
	for _, id := range verifiedIDs {
		normalized := NormalizeTEL(id)
		if normalized == "" {
			t.Errorf("NormalizeTEL(%q) returned an empty string", id)
		}
		t.Logf("Normalized Tel: %s", normalized)
		if !ValidateTEL(id) {
			t.Errorf("ValidateTEL(%q) = false, expected true", id)
		}
	}
}
