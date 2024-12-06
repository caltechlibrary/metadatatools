
const pubMedIDPattern = /^[0-9]+$/;

/**
 * normalizePMID normalized the Pub Med ID.
 * 
 * @param pubMedID, a string representing a pmid.
 * @returns string
 */
export function normalizePMID(pubMedID: string): string {
    return pubMedID.replace(/pmid:\s+|pmid:/i,'').trim();
}

/**
 * validatePMID will check a if a pmid is valid after normalization.
 *
 * @param pubMedID validatePubMedID validates a Pub Med ID.
 * @returns true if validates, false otherwise
 */
export function validatePMID(pubMedID: string): boolean {
    const normalizedID = normalizePMID(pubMedID);
    return pubMedIDPattern.test(normalizedID);
}

