//
// This following generates a list of questions to feed into an LLM for code generation.
//
const identifier_types: object = {
    "ISBN": "ISBN",
    "ISSN": "ISSN",
    "DOI": "DOI",
    "ISNI": "ISNI",
    "ORCID": "ORCID",
    "ROR": "ROR",
    "ISTC": "ISTC (International Standard Text Code)",
    "handle": "handle identifier",
    "EAN": "EAN (International Article Number (EAN-13 or EAN-8))",
    "URL": "URL",
    "URI": "URI",
    "URN": "URL",
    "PURL": "PURL",
    "ADS": "ADS bibliographic code",
    "arXiv": "arXiv ID",
    "PMID": "PubMed ID",
    "PMCID": "PubMed Central ID",
    "GND": "GND Identifier",
    "SRA": "SRA accession identifier",
    "BioProject": "BioProject accession identifier",
    "BioSample": "BioSample accession identifier",
    "Ensembl": "Ensembl accession identifier",
    "UniProt": "UniProt accession identifier",
    "RefSeq": "RefSeq accession identifier",
    "FundRef": "FundRef ID",
    "Genome": "GenBank or RefSeq genome assembly accession identifier",
    "detect_identifier_schemes": "detect identifier schemes",
    "LCNAF": "LACNAF ID",
    "VIAF": "VIAF ID",
    "SNAC": "SNAC ID"
};
let i = 1;
for (let k of Object.keys(identifier_types)) {
    console.log(`## ${i}. How do I write a validator, verifier and normalize functions for ${identifier_types[k]} in Deno and TypeScript? What is the copyright or attribution requirements to use this code?`);
    console.log("");
    i++;
}
