package metadatatools

// VerifyFundRefID verifies a FundRef ID exists via CrossRef's API. The
// identifier is normalized before verifying.
func VerifyFundRefID(id string) bool {
	normalized := NormalizeFundRefID(id)
	return VerifyIdentifier(id, "https://api.crossref.org/funders/"+normalized, ValidateFundRefID)
}
