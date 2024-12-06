const pmcidPattern = /^PMC\d+$/;

export function normalizePMCID(pmcid: string): string {
  let cleanedID = pmcid.trim().toUpperCase();
  if (pmcid.startsWith("PMC")) {
    return cleanedID;
  }
  return `PMC${cleanedID}`;
}

export function validatePMCID(pmcid: string): boolean {
  const normalizedID = normalizePMCID(pmcid);
  return pmcidPattern.test(normalizedID);
}
