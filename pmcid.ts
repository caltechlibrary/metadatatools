export const PMCIDPattern: string = "^PMC\\d+$";
export const rePMCID: RegExp = new RegExp(PMCIDPattern);

export function normalizePMCID(pmcid: string): string {
  const cleanedID = pmcid.trim().toUpperCase();
  if (pmcid.startsWith("PMC")) {
    return cleanedID;
  }
  return `PMC${cleanedID}`;
}

export function validatePMCID(pmcid: string): boolean {
  const normalizedID = normalizePMCID(pmcid);
  return rePMCID.test(normalizedID);
}
