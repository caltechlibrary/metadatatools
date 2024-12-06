
const rorPrefix = 'https://ror.org/';
const rorPattern = /^https:\/\/ror\.org\/0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$|^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$/;

/**
 * normalizeROR takes a string and returns a normalized vesion of the ROR
 * @param ror 
 * @returns string
 */
export function normalizeROR(ror: string): string {
    let cleanedROR = ror.trim().toLowerCase();
    if (cleanedROR.startsWith(rorPrefix)) {
        return cleanedROR;
    }
    return `${rorPrefix}${cleanedROR}`;
};

/**
 * validateROR takes a string and return true if it is a valid ROR and false otherwise.
 * The ROR will be normalized before validation.
 * @param ror
 * @returns true if a valid ROR, false otherwise
 */
export function validateROR(ror: string): boolean {
    const normalizedROR = normalizeROR(ror);
    return rorPattern.test(normalizedROR);
};

