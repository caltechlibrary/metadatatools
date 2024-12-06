const VIAFPattern = /^\d+$/; // VIAF IDs are numeric

/**
 * normalizeVIAF
 * @param id, a string holding the VIAF identifier
 * @returns normalized VIAF identifier as a string.
 */
export function normalizeVIAF(id: string): string {
    return id.trim();
}

/**
 * validateVIAF validates the VIAF ID normalizing first.
 * @param id, VIAD identifier string
 * @returns true if valid, false otherwise
 */
export function validateVIAF(id: string): boolean {
    const normalizedID = normalizeVIAF(id);
    return VIAFPattern.test(normalizedID);
}
  