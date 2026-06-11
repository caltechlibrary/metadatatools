package metadatatools

import "net/url"

// VerifyORCID verifies an ORCID iD exists via orcid.org. The identifier
// is normalized before verifying.
func VerifyORCID(orcid string) bool {
	normalized := NormalizeORCID(orcid)
	return VerifyIdentifier(orcid, "https://orcid.org/"+url.QueryEscape(normalized), ValidateORCID)
}
