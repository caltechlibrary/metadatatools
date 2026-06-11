package metadatatools

import "testing"

func TestFundRefID(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}

	verifiedIDs := []string{
		"10.13039/100000001",
		"10.13039/100000009",
	}

	for _, id := range verifiedIDs {
		normalized := NormalizeFundRefID(id)
		if normalized == "" {
			t.Errorf("NormalizeFundRefID(%q) returned an empty string", id)
		}
		t.Logf("Normalized FundRef ID: %s", normalized)

		if !ValidateFundRefID(id) {
			t.Errorf("ValidateFundRefID(%q) = false, expected true", id)
		}

		if !VerifyFundRefID(id) {
			t.Errorf("VerifyFundRefID(%q) = false, expected true", id)
		}
	}
}
