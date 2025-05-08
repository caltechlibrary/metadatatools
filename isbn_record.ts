/**
 * this provided verification and object retrievala for ISBN data. It relies on openlibrary.org for both.
 * @module
 */
import { getObject, verifyIdentifier } from "./utility.ts";
import { normalizeISBN, validateISBN } from "./isbn.ts";

/**
 * Verifies an ISBN using the Open Library API.
 * @param isbn - The identifier to verify.
 * @returns Promise<boolean> - True if the ISBN exists at Open Library, false otherwise.
 * 
 * @example
 * ```ts
 *  const isbn: string = '978-3-16-148410-0';
 * 
 *  if (await verifyISBN(isbn)) {
 *      console.log(`{isbn} has been varified against OpenLibrary.org data`);
 *  } else {
 *      console.error(`{isbn} failed to be varified against OpenLibrary.org data`);
 *  }
 * ```
 */
export async function verifyISBN(isbn: string): Promise<boolean> {
  const normalizedISBN = normalizeISBN(isbn);
  return await verifyIdentifier(
    isbn,
    `https://openlibrary.org/isbn/${encodeURIComponent(normalizedISBN)}.json`,
    validateISBN,
  );
}

/**
 * getObjectISBN retrieves an ISBN record from OpenLibrary.org
 * @param isbn - The identifier of the object to retreive.
 * @returns Promise<object | undefined>, if object can't be retrieved or JSON fail to parse undefined is returned.
 * 
 * @example
 * ```ts
 *  const isbn: string = '978-3-16-148410-0';
 *  const obj: {[key:string]: any} = await getObjectISBN(isbn);
 * 
 *  if (obj === undefined) {
 *      console.error(`${isbn} data was not available from OpenLibrary.org data`);
 *  } else {
 *      console.log(`${isbn} data retrieved from OpenLibrary.org ${obj}`);
 *  }
 * ```
 */
export async function getObjectISBN(isbn: string): Promise<object | undefined> {
  const normalizedISBN = normalizeISBN(isbn);
  return await getObject(
    isbn,
    `https://openlibrary.org/isbn/${encodeURIComponent(normalizedISBN)}.json`,
    validateISBN,
  );
}
