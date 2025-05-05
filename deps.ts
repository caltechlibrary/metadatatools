// arxiv.ts export
export { normalizeArXivID, validateArXivID } from "./arxiv.ts";

// arxiv_record.ts export
export { verifyArXivID } from "./arxiv_record.ts";

// doi.ts export
export { normalizeDOI, validateDOI } from "./doi.ts";

// doi_record.ts export
export { getObjectDOI, verifyDOI } from "./doi_record.ts";

// ean.ts export
export { normalizeEAN, validateEAN } from "./ean.ts";

// email.ts export
export { normalizeEMAIL, validateEMAIL } from "./email.ts";

// fundref.ts export
export { normalizeFundRefID, validateFundRefID } from "./fundref.ts";

// fundref_record.ts export
export { verifyFundRefID } from "./fundref_record.ts";

// isbn.ts export
export { normalizeISBN, validateISBN } from "./isbn.ts";

// isbn_record.ts export
export { getObjectISBN, verifyISBN } from "./isbn_record.ts";

// isni.ts export
export { ISNIPattern, normalizeISNI, reISNI, validateISNI } from "./isni.ts";

// isni_record.ts export
export { verifyISNI } from "./isni_record.ts";

// issn.ts export
export { normalizeISSN, validateISSN } from "./issn.ts";

// issn_record.ts export
export { verifyISSN } from "./issn_record.ts";

// lcnaf.ts export
export { normalizeLCNAF, validateLCNAF } from "./lcnaf.ts";

// lcnaf_record.ts export
export { verifyLCNAF } from "./lcnaf_record.ts";

// orcid.ts export
export {
  normalizeORCID,
  ORCIDPattern,
  reORCID,
  validateORCID,
} from "./orcid.ts";

// orcid_record.ts export
export { verifyORCID } from "./orcid_record.ts";

// pmcid.ts export
export { normalizePMCID, validatePMCID } from "./pmcid.ts";

// pmcid_record.ts export
export { verifyPMCID } from "./pmcid_record.ts";

// pmid.ts export
export { normalizePMID, validatePMID } from "./pmid.ts";

// pmid_record.ts export
export { verifyPMID } from "./pmid_record.ts";

// ror.ts export
export { normalizeROR, reROR, RORPattern, validateROR } from "./ror.ts";

// ror_record.ts export
export { verifyROR } from "./ror_record.ts";

// snac.ts export
export { normalizeSNAC, validateSNAC } from "./snac.ts";

// snac_record.ts export
export { verifySNAC } from "./snac_record.ts";

// tel.ts
export { normalizeTEL, validateTEL } from "./tel.ts";

// uuid.ts export
export { normalizeUUID, validateUUID } from "./uuid.ts";

// NOTE: there is no uuid_record.ts as there is no remote API

// utility.ts export
export { getObject, verifyIdentifier } from "./utility.ts";

// utility.ts types
export type { normalizorFunc, validatorFunc, verifyFunc } from "./utility.ts";

// version.ts export
export { version, licenseText, releaseDate, releaseHash } from "./version.ts";

// viaf.ts export
export { normalizeVIAF, validateVIAF } from "./viaf.ts";

// viaf_record.ts export
export { verifyVIAF } from "./viaf_record.ts";

// helptext.ts export
export { fmtHelp, helpText } from "./helptext.ts";

