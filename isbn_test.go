package metadatatools

import "testing"

func TestISBN(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"0-306-40615-2",
		"978-3-16-148410-0",
		"978-1606069424",
		"160606942X",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeISBN(id)
		if normalized == "" {
			t.Errorf("NormalizeISBN(%q) returned an empty string", id)
		}
		t.Logf("Normalized ISBN: %s", normalized)

		if !ValidateISBN(id) {
			t.Errorf("ValidateISBN(%q) = false, expected true", id)
		}

		if !VerifyISBN(id) {
			t.Errorf("VerifyISBN(%q) = false, expected true", id)
		}

		if obj, ok := GetObjectISBN(id); !ok || obj == nil {
			t.Errorf("GetObjectISBN(%q) = (%v, %v), expected an object and true", id, obj, ok)
		}
	}
}
