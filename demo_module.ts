/**
 * demonostratuion of how you might use the modules provided by metadatatools.
 */
import {
  normalizeDOI,
  normalizeORCID,
  normalizeROR,
  validateDOI,
  validateORCID,
  validateROR,
  verifyDOI,
  verifyORCID,
  verifyROR,
} from "./mod.ts";

const orcid = "0000-0003-0900-6903",
  verifiedORCID = await verifyORCID(orcid),
  ror = "https://ror.org/00mpvse27",
  verifiedROR = await verifyROR(ror),
  doi = "https://doi.org/10.1128/jmbe.00128-21",
  verifiedDOI = await verifyDOI(doi);

console.log(
  `ORCID ${normalizeORCID(orcid)} -> is valid? ${
    validateORCID(orcid)
  } -> verfied? ${verifiedORCID}`,
);
console.log(
  `ORCID ${normalizeROR(ror)} -> is valid? ${
    validateROR(ror)
  } -> verfied? ${verifiedROR}`,
);
console.log(
  `ORCID ${normalizeDOI(doi)} -> is valid? ${
    validateDOI(doi)
  } -> verfied? ${verifiedDOI}`,
);
