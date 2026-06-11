package metadatatools

// VerifySNAC verifies a SNAC ID exists via the SNAC Cooperative website.
// The identifier is normalized before verifying.
func VerifySNAC(id string) bool {
	normalized := NormalizeSNAC(id)
	return VerifyIdentifier(id, "https://snaccooperative.org/view/"+normalized, ValidateSNAC)
}
