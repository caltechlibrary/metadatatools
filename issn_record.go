package metadatatools

import "net/url"

// VerifyISSN verifies an ISSN exists via portal.issn.org. The
// identifier is normalized before verifying.
func VerifyISSN(issn string) bool {
	normalized := NormalizeISSN(issn)
	return VerifyIdentifier(issn, "https://portal.issn.org/resource/ISSN/"+url.QueryEscape(normalized), ValidateISSN)
}
