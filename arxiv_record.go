package metadatatools

import "strings"

// VerifyArXivID verifies an arXiv identifier exists via the
// export.arxiv.org API. The identifier is normalized before verifying.
func VerifyArXivID(arxiv string) bool {
	normalized := NormalizeArXivID(arxiv)
	id := strings.TrimSpace(strings.TrimPrefix(normalized, "arxiv:"))
	return VerifyIdentifier(arxiv, "https://export.arxiv.org/api/query?id_list="+id, ValidateArXivID)
}
