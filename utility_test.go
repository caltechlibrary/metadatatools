package metadatatools

import (
	"testing"
)

func noOp(_ string) bool {
	return true
}

func TestVerifyIdentifier(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}
	objectURLs := []string{
		"https://caltechlibrary.github.io/dataset/README.md",
	}
	for _, u := range objectURLs {
		if ok := VerifyIdentifier(u, u, noOp); !ok {
			t.Errorf("VerifyIdentifier(%q, %q, noOp) = false, expected true", u, u)
		}
	}
}

func TestGetObject(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping network test in short mode")
	}
	objectURLs := []string{
		"https://feeds.library.caltech.edu/recent/article.json",
	}
	for _, u := range objectURLs {
		obj, ok := GetObject(u, u, noOp)
		if !ok || obj == nil {
			t.Errorf("GetObject(%q, %q, noOp) = (%v, %v), expected an object and true", u, u, obj, ok)
		}
	}
}
