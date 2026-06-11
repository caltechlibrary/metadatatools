package metadatatools

// VerifyLCNAF verifies an LCNAF ID exists via id.loc.gov. The identifier
// is normalized before verifying.
func VerifyLCNAF(id string) bool {
	normalized := NormalizeLCNAF(id)
	return VerifyIdentifier(id, "https://id.loc.gov/authorities/names/"+normalized+".json", ValidateLCNAF)
}
