package metadatatools

// VerifyVIAF verifies a VIAF ID exists via viaf.org. The identifier is
// normalized before verifying.
func VerifyVIAF(id string) bool {
	normalized := NormalizeVIAF(id)
	return VerifyIdentifier(id, "https://viaf.org/viaf/"+normalized, ValidateVIAF)
}
