package metadatatools

import "testing"

func TestUUID(t *testing.T) {
	verifiedIDs := []string{
		"13e4f940-b7ed-11ef-a2c5-ed8b1faf2c9d",
		"a6435f0d-60ea-47a7-94ff-1d1c394c1280",
		"21bbd59d-9801-53ce-8902-9559de3ebd39",
	}
	for _, id := range verifiedIDs {
		normalized := NormalizeUUID(id)
		if normalized == "" {
			t.Errorf("NormalizeUUID(%q) returned an empty string", id)
		}
		t.Logf("Normalized UUID: %s", normalized)
		if !ValidateUUID(id) {
			t.Errorf("ValidateUUID(%q) = false, expected true", id)
		}
	}
}
