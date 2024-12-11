import { validate } from "@std/uuid";

/**
 * normalizedUUID will trim, lower case and remove spaces from a string.
 * @param uuid
 * @returns the normalized string
 */
export function normalizeUUID(uuid: string): string {
    return uuid.replace(/\s+/,'').toLowerCase().trim();
}

/**
 * validateUUID will normalize a UUID then validate it. It uses
 * the Deno standard UUID module which supports v1, v3, v4 and v5
 * validation.
 * @param uuid 
 * @returns true if valid, false otherwise
 */
export function validateUUID(uuid: string): boolean {
    const normalized = normalizeUUID(uuid);
    return validate(normalized);
}
