package metadatatools

import (
	"regexp"
	"strings"
)

// PMCIDPattern matches a normalized PubMed Central identifier.
const PMCIDPattern = `^PMC\d+$`

// rePMCID is the compiled form of PMCIDPattern.
var rePMCID = regexp.MustCompile(PMCIDPattern)

// NormalizePMCID trims whitespace from pmcid, upper cases it, and adds
// a leading "PMC" if pmcid does not already start with one.
func NormalizePMCID(pmcid string) string {
	cleaned := strings.ToUpper(strings.TrimSpace(pmcid))
	if strings.HasPrefix(pmcid, "PMC") {
		return cleaned
	}
	return "PMC" + cleaned
}

// ValidatePMCID normalizes pmcid then validates it against PMCIDPattern.
func ValidatePMCID(pmcid string) bool {
	return rePMCID.MatchString(NormalizePMCID(pmcid))
}
