package metadatatools

// VerifyPMCID verifies a PMCID exists via www.ncbi.nlm.nih.gov/pmc. The
// identifier is normalized before verifying.
func VerifyPMCID(pmcid string) bool {
	normalized := NormalizePMCID(pmcid)
	return VerifyIdentifier(pmcid, "https://www.ncbi.nlm.nih.gov/pmc/articles/"+normalized+"/", ValidatePMCID)
}
