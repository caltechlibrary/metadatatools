package metadatatools

import (
	"regexp"
	"testing"
)

func TestEAN(t *testing.T) {
	verifiedIDs := []string{
		"9780201544282",
	}
	for _, id := range verifiedIDs {
		expected := id
		normalized := NormalizeEAN(id)
		if normalized != expected {
			t.Errorf("NormalizeEAN(%q) = %q, expected %q", id, normalized, expected)
		}
		if !ValidateEAN(id) {
			t.Errorf("ValidateEAN(%q) = false, expected true", id)
		}
	}

	reLowerAlpha := regexp.MustCompile(`[a-z]`)
	invalidIDs := []string{
		"xx000222jwwheeot",
	}
	for _, id := range invalidIDs {
		expected := reLowerAlpha.ReplaceAllString(id, "")
		normalized := NormalizeEAN(id)
		if normalized != expected {
			t.Errorf("NormalizeEAN(%q) = %q, expected %q", id, normalized, expected)
		}
		if normalized == id {
			t.Errorf("NormalizeEAN(%q) = %q, expected it to differ from %q", id, normalized, id)
		}
		if ValidateEAN(id) {
			t.Errorf("ValidateEAN(%q) = true, expected false", id)
		}
	}
}
