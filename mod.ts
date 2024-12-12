export { appInfo } from "./version.ts";
export {
  ARXIVPattern,
  newARXIVPattern,
  normalizeArXivID,
  oldARXIVPattern,
  reARXIV,
  reNewARXIV,
  reOldARXIV,
  validateArXivID,
} from "./arxiv.ts";
export { verifyArXivID } from "./arxiv_record.ts";
export { DOIPattern, normalizeDOI, reDOI, validateDOI } from "./doi.ts";
export { verifyDOI } from "./doi_record.ts";
export {
  ISBN10Pattern,
  ISBN13Pattern,
  ISBNPattern,
  normalizeISBN,
  reISBN,
  reISBN10,
  reISBN13,
  validateISBN,
} from "./isbn.ts";
export { verifyISBN } from "./isbn_record.ts";
export { ISNIPattern, normalizeISNI, reISNI, validateISNI } from "./isni.ts";
export { verifyISNI } from "./isni_record.ts";
export { ISSNPattern, reISSN, normalizeISSN, validateISSN } from "./issn.ts";
export { verifyISSN } from "./issn_record.ts";
export {
  LCNAFPattern,
  normalizeLCNAF,
  reLCNAF,
  validateLCNAF,
} from "./lcnaf.ts";
export { verifyLCNAF } from "./lcnaf_record.ts";
export {
  normalizeORCID,
  ORCIDPattern,
  reORCID,
  validateORCID,
} from "./orcid.ts";
export { verifyORCID } from "./orcid_record.ts";
export { PMCIDPattern, rePMCID, normalizePMCID, validatePMCID } from "./pmcid.ts";
export { verifyPMCID } from "./pmcid_record.ts";
export { PMIDPattern, rePMID, normalizePMID, validatePMID } from "./pmid.ts";
export { verifyPMID } from "./pmid_record.ts";
export { reROR, RORPattern, normalizeROR, validateROR } from "./ror.ts";
export { verifyROR } from "./ror_record.ts";
export { SNACPattern, reSNAC, normalizeSNAC, validateSNAC } from "./snac.ts";
export { verifySNAC } from "./snac_record.ts";
export { VIAFPattern, reVIAF, normalizeVIAF, validateVIAF } from "./viaf.ts";
export { verifyVIAF } from "./viaf_record.ts";
export { TELPattern, reTEL, normalizeTEL, validateTEL } from './tel.ts';
export { EMAILPattern, reEMAIL, normalizeEMAIL, validateEMAIL } from './email.ts';