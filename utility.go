package metadatatools

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
)

// userAgent identifies this library to remote services. Some
// Cloudflare-protected services (e.g. viaf.org) reject requests made
// with Go's default "Go-http-client" User-Agent.
const userAgent = "metadatatools/" + Version + " (+https://github.com/caltechlibrary/metadatatools)"

// httpGet issues a GET request to u with userAgent set.
func httpGet(u string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)
	return http.DefaultClient.Do(req)
}

// reNonDigit matches any character that is not an ASCII digit.
var reNonDigit = regexp.MustCompile(`\D`)

// reWhitespace matches one or more whitespace characters.
var reWhitespace = regexp.MustCompile(`\s+`)

// digitsOf converts a string of ASCII digits into their integer values.
// Callers must ensure s contains only the digits '0' through '9'.
func digitsOf(s string) []int {
	digits := make([]int, len(s))
	for i := 0; i < len(s); i++ {
		digits[i] = int(s[i] - '0')
	}
	return digits
}

// joinGroups splits s into chunks sized by sizes (in order), with any
// remaining characters forming a final chunk, then joins the chunks
// with sep. It mirrors the chained String.slice grouping used to format
// identifiers such as ORCID, ISNI, ISBN, and ISSN.
func joinGroups(s string, sep string, sizes ...int) string {
	groups := make([]string, 0, len(sizes)+1)
	pos := 0
	for _, n := range sizes {
		end := pos + n
		if end > len(s) {
			end = len(s)
		}
		groups = append(groups, s[pos:end])
		pos = end
	}
	groups = append(groups, s[pos:])
	return strings.Join(groups, sep)
}

// ValidatorFunc checks if the form of an identifier string is valid.
type ValidatorFunc func(string) bool

// NormalizorFunc returns an identifier in a regularized format.
type NormalizorFunc func(string) string

// VerifyFunc checks with an authoritative source that an identifier exists.
type VerifyFunc func(string) bool

// VerifyIdentifier attempts to retrieve an object from a remote source.
// It validates identifier first; if validate returns false, or the GET
// to u fails or does not return a 2xx status, it returns false.
func VerifyIdentifier(identifier string, u string, validate ValidatorFunc) bool {
	if !validate(identifier) {
		return false
	}
	resp, err := httpGet(u)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode >= 200 && resp.StatusCode < 300
}

// GetObject is a generic retrieval of a JSON value from a remote source.
// It validates identifier before fetching u. The second return value
// is false if validation fails, the request fails, the response is not
// a 2xx, or the response body cannot be parsed as JSON. The decoded value
// may be a map, slice, or scalar depending on what u returns.
func GetObject(identifier string, u string, validate ValidatorFunc) (interface{}, bool) {
	if !validate(identifier) {
		return nil, false
	}
	resp, err := httpGet(u)
	if err != nil {
		return nil, false
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, false
	}
	var obj interface{}
	if err := json.NewDecoder(resp.Body).Decode(&obj); err != nil {
		return nil, false
	}
	return obj, true
}
