package metadatatools

// VerifyPMID verifies a PMID exists via pubmed.ncbi.nlm.nih.gov. The
// identifier is normalized before verifying.
func VerifyPMID(pmid string) bool {
	normalized := NormalizePMID(pmid)
	return VerifyIdentifier(pmid, "https://pubmed.ncbi.nlm.nih.gov/"+normalized+"/", ValidatePMID)
}
