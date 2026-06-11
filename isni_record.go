package metadatatools

import (
	"net/url"
	"strings"
)

// VerifyISNI verifies an ISNI exists via isni.org. The identifier is
// normalized before verifying.
func VerifyISNI(isni string) bool {
	bare := strings.ReplaceAll(NormalizeISNI(isni), " ", "")
	return VerifyIdentifier(isni, "https://isni.org/isni/"+url.QueryEscape(bare), ValidateISNI)
}
