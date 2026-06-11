package metadatatools

import (
	"regexp"
	"strings"
)

// ARXIVPattern matches a normalized arXiv identifier in either the new
// (YYMM.NNNNN) or old (archive/YYMMNNN) form, with an optional version
// suffix.
const ARXIVPattern = `^arxiv:(\d{4}\.\d{4,5}(v\d+)?|[a-z\-]+/\d{7}(v\d+)?)$`

// reARXIV is the compiled, case-insensitive form of ARXIVPattern.
var reARXIV = regexp.MustCompile(`(?i)` + ARXIVPattern)

// NewARXIVPattern matches a normalized arXiv identifier in the new
// (post March 2007) YYMM.NNNNN form.
const NewARXIVPattern = `^arxiv:\d{4}\.\d{4,5}(v\d+)?$`

// reNewARXIV is the compiled, case-insensitive form of NewARXIVPattern.
var reNewARXIV = regexp.MustCompile(`(?i)` + NewARXIVPattern)

// OldARXIVPattern matches a normalized arXiv identifier in the old
// (pre March 2007) archive/YYMMNNN form.
const OldARXIVPattern = `^arxiv:[a-z\-]+/\d{7}(v\d+)?$`

// reOldARXIV is the compiled, case-insensitive form of OldARXIVPattern.
var reOldARXIV = regexp.MustCompile(`(?i)` + OldARXIVPattern)

// NormalizeArXivID trims whitespace from arxivID and lower cases it.
//
// Example:
//
//	id := NormalizeArXivID("ARXIV:2412.03631")
//	// id == "arxiv:2412.03631"
func NormalizeArXivID(arxivID string) string {
	return strings.ToLower(strings.TrimSpace(arxivID))
}

// ValidateArXivID normalizes arxivID then validates it against ARXIVPattern.
func ValidateArXivID(arxivID string) bool {
	return reARXIV.MatchString(NormalizeArXivID(arxivID))
}
