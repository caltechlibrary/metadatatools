package metadatatools

import (
	"regexp"
	"strings"
)

// PMIDPattern matches a normalized PubMed identifier (digits only).
const PMIDPattern = `^[0-9]+$`

// rePMID is the compiled form of PMIDPattern.
var rePMID = regexp.MustCompile(PMIDPattern)

// rePMIDPrefix matches a leading "pmid:" label, with or without
// trailing whitespace.
var rePMIDPrefix = regexp.MustCompile(`(?i)pmid:\s*`)

// NormalizePMID removes a leading "pmid:" label and surrounding
// whitespace from pubMedID.
func NormalizePMID(pubMedID string) string {
	return strings.TrimSpace(rePMIDPrefix.ReplaceAllString(pubMedID, ""))
}

// ValidatePMID normalizes pubMedID then validates it against PMIDPattern.
func ValidatePMID(pubMedID string) bool {
	return rePMID.MatchString(NormalizePMID(pubMedID))
}
