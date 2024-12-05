import { getObject, verifyIdentifier } from "./utility.ts";
import { normalizeISBN, validateISBN } from "./isbn.ts";

/**
 * Verifies an ISBN using the Open Library API.
 * @param isbn - The identifier to verify.
 * @returns Promise<boolean> - True if the ISBN exists, false otherwise.
 */
export async function verifyISBN(isbn: string): Promise<boolean> {
  const normalizedISBN = normalizeISBN(isbn);
  return verifyIdentifier(
    isbn,
    `https://openlibrary.org/isbn/${encodeURIComponent(normalizedISBN)}.json`,
    validateISBN
  );
}

/**
 * getObjectISBN retrieves an ISBN record from OpenLibrary.org
 * @param isbn - The identifier of the object to retreive.
 * @returns Promise<object | undefined>, if object can't be retrieved or JSON fail to parse undefined is returned.
 */
export async function getObjectISBN(isbn: string): Promise<object | undefined> {
  const normalizedISBN = normalizeISBN(isbn);
  return await getObject(
    isbn,
    `https://openlibrary.org/isbn/${encodeURIComponent(normalizedISBN)}.json`,
    validateISBN
  );
}
