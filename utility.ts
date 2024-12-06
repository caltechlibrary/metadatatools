export type validatorFunc = (arg0: string) => boolean;
export type normalizorFunc = (arg0: string) => string;

/**
 * verifyIdentifier attempts to retrieve an object from a remote source.
 * @param identifier: string, the identifier of the object to be retrieved.
 * @param url: string, the URL to use to retrieve the object from.
 * @param validate: validatorFunc, a function that accepts a string and returns a boolean, the fetch will not occur if false is returned.
 * @returns Promise<boolean> - True if the identifier can be retrieved exists, false otherwise.
 */
export async function verifyIdentifier(
  identifier: string,
  u: string,
  validate: validatorFunc,
): Promise<boolean> {
  if (validate(identifier)) {
    //    console.log(`DEBUG getting response from ${u}`);
    const response = await fetch(u);
    //    console.log(`DEBUG response -> ${typeof response} -> ${response}`);
    if (response !== undefined && response !== null) {
      return response.ok;
    }
  }
  return false;
}

/**
 * getObject is a generic retrieval of an object from a remote source. It applies the normalizer, validator to the provided identfier before
 * fetching the URL.
 * @param identifier: string, the identifier of the object to be retrieved.
 * @param url: string, the URL to use to retrieve the object from.
 * @param validate: validatorFunc, a function that accepts a string and returns a boolean, the fetch will not occur if false is returned.
 * @return Promise<object | undefined>, if the retrieval failes or can't be parse as JSON it returns undefined, otherwise the object
 */
export async function getObject(
  identifier: string,
  url: string,
  validate: validatorFunc,
): Promise<object | undefined> {
  if (validate(identifier)) {
    const response = await fetch(url);
    if (response !== undefined && response !== null && response.ok) {
      const src = await response.text();
      console.log(`DEBUG src -> ${src}`);
      try {
        return JSON.parse(src);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}
