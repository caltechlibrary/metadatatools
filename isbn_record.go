package metadatatools

import "net/url"

// VerifyISBN verifies an ISBN exists via Open Library. The identifier
// is normalized before verifying.
func VerifyISBN(isbn string) bool {
	normalized := NormalizeISBN(isbn)
	return VerifyIdentifier(isbn, "https://openlibrary.org/isbn/"+url.QueryEscape(normalized)+".json", ValidateISBN)
}

// GetObjectISBN retrieves an ISBN record from Open Library.
func GetObjectISBN(isbn string) (interface{}, bool) {
	normalized := NormalizeISBN(isbn)
	return GetObject(isbn, "https://openlibrary.org/isbn/"+url.QueryEscape(normalized)+".json", ValidateISBN)
}
