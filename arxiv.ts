/**
 * This module provides nomralization and validation of the form of the ArXiv identifier.
 * 
 * @module metadatatools
 */

export const ARXIVPattern: string =
  "^arxiv:(\\d{4}\\.\\d{4,5}(v\\d+)?|[a-z\\-]+\\/\\d{7}(v\\d+)?)$";
export const reARXIV: RegExp = new RegExp(ARXIVPattern, "i");
export const newARXIVPattern: string = "^arxiv:\\d{4}\\.\\d{4,5}(v\\d+)?$";
export const reNewARXIV: RegExp = new RegExp(newARXIVPattern, "i");
export const oldARXIVPattern: string = "^arxiv:[a-z\\-]+\\/\\d{7}(v\\d+)?$";
export const reOldARXIV: RegExp = new RegExp(oldARXIVPattern, "i");

/**
 * normalizes the arxiv identifier string
 * @param arxivID 
 * @returns stirng with the normalized ArXiv identifier
 * 
 * @example
 * ```ts
 *   const arxiv: string = normalizeArXivID('ARXIV:2412.03631');
 * 
 *   console.log(arxiv); // displays arXiv:2412.03631
 * ```
 */
export function normalizeArXivID(arxivID: string): string {
  return arxivID.trim().toLowerCase();
}

/**
 * noarmlizes the arxiv identifier
 * @param arxivID 
 * @returns stirng with the normalized ArXiv identifier
 * 
 * @example
 * ```ts
 *   const arxiv: string = normalizeArXivID('ARXIV:2412.03631');
 * 
 *   if (validateArXivID(arxiv)) {
 *       console.log(`${arxiv} appears valid`);
 *   } else {
 *       console.error(`${arxiv}, failed validation`);
 *   }
 * ```
 */
export function validateArXivID(arxivID: string): boolean {
  const normalizedID = normalizeArXivID(arxivID);
  return reARXIV.test(normalizedID);
}
