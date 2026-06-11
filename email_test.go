package metadatatools

import "testing"

func TestEMAIL(t *testing.T) {
	verifiedIDs := []string{
		"a@localhost",
		"a.b@localhost",
		"b_2@example.edu",
		"b3@library.example.edu",
		"b4@agents.library.example.edu",
	}
	for _, id := range verifiedIDs {
		normalized := NormalizeEMAIL(id)
		if normalized == "" {
			t.Errorf("NormalizeEMAIL(%q) returned an empty string", id)
		}
		t.Logf("Normalized Email: %s", normalized)
		if !ValidateEMAIL(id) {
			t.Errorf("ValidateEMAIL(%q) = false, expected true", id)
		}
	}
}
