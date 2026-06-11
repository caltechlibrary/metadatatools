package metadatatools

import (
	"net/url"
)

// VerifyDOI verifies a DOI is registered via the DOI handle system
// (doi.org).
//
// Example:
//
//	doi := "10.22002/bv2pv-2b295"
//	if VerifyDOI(doi) {
//	    fmt.Printf("%s appears valid\n", doi)
//	} else {
//	    fmt.Printf("%s is not valid\n", doi)
//	}
func VerifyDOI(doi string) bool {
	short := NormalizeDOIShort(doi)
	return VerifyIdentifier(doi, "https://doi.org/api/handles/"+url.QueryEscape(short), ValidateDOI)
}

// GetObjectDOI retrieves a DOI record from CrossRef, falling back to
// DataCite if CrossRef does not have it.
//
// Example:
//
//	doi := "10.22002/bv2pv-2b295"
//	obj, ok := GetObjectDOI(doi)
//	if !ok {
//	    fmt.Printf("%s did not return an object, maybe it is not valid\n", doi)
//	} else {
//	    fmt.Printf("%s returns an object %v\n", doi, obj)
//	}
func GetObjectDOI(doi string) (interface{}, bool) {
	short := NormalizeDOIShort(doi)
	obj, ok := GetObject(doi, "https://api.crossref.org/works/"+url.QueryEscape(short), ValidateDOI)
	if !ok {
		return GetObject(doi, "https://api.datacite.org/dois/"+url.QueryEscape(short), ValidateDOI)
	}
	return obj, ok
}
