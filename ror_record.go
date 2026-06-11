package metadatatools

// VerifyROR verifies a ROR identifier exists via ror.org. The
// identifier is normalized (and resolves directly to its ror.org URL)
// before verifying.
func VerifyROR(ror string) bool {
	normalized := NormalizeROR(ror)
	return VerifyIdentifier(ror, normalized, ValidateROR)
}
