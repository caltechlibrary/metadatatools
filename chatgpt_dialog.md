
# Reference material for implement identifier validation, verification and normalization

The following is an edited transcript of a dialog with ChatGPT for implementing various identifier type functions and CiteProc functions which are useful for libraries and archives.  The original transcript is available at <https://chatgpt.com/share/6750f3c6-8a54-8001-bc85-ed8a69d6a364>.


## 1. How do I write a validator, verifier and normalize functions for ISBN in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing a Validator, Verifier, and Normalize Functions for ISBN in Deno and TypeScript

**ISBN** (International Standard Book Number) comes in two formats: **ISBN-10** and **ISBN-13**. A well-written implementation should:

1. Validate that the ISBN conforms to either format.
2. Normalize the ISBN by ensuring consistency (e.g., removing hyphens).
3. Optionally verify its validity using online services like ISBNdb or Open Library.

---

### Implementation

Here’s how to implement the validator, verifier, and normalizer for ISBN in Deno and TypeScript.

#### 1. Validator

The validator checks:
- The length (10 or 13 characters).
- The structure (numeric characters and possible "X" for ISBN-10).
- The checksum for correctness.

```typescript
/**
 * Validates an ISBN-10.
 * @param isbn - The ISBN-10 string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
function validateISBN10(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
  if (cleanISBN.length !== 10) return false;

  const checksum = cleanISBN
    .split('')
    .slice(0, 9)
    .reduce((sum, char, index) => sum + (parseInt(char) * (10 - index)), 0);

  const checkDigit = cleanISBN[9].toUpperCase() === 'X' ? 10 : parseInt(cleanISBN[9]);
  return (checksum + checkDigit) % 11 === 0;
}

/**
 * Validates an ISBN-13.
 * @param isbn - The ISBN-13 string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
function validateISBN13(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9]/g, '');
  if (cleanISBN.length !== 13) return false;

  const checksum = cleanISBN
    .split('')
    .reduce(
      (sum, char, index) =>
        sum + parseInt(char) * (index % 2 === 0 ? 1 : 3),
      0
    );

  return checksum % 10 === 0;
}

/**
 * Validates an ISBN (either ISBN-10 or ISBN-13).
 * @param isbn - The ISBN string to validate.
 * @returns boolean - True if valid, false otherwise.
 */
export function validateISBN(isbn: string): boolean {
  const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
  if (cleanISBN.length === 10) return validateISBN10(cleanISBN);
  if (cleanISBN.length === 13) return validateISBN13(cleanISBN);
  return false;
}
```

---

#### 2. Normalizer

The normalizer ensures the ISBN is consistent (e.g., removes spaces or hyphens).

```typescript
/**
 * Normalizes an ISBN by removing hyphens and spaces.
 * @param isbn - The ISBN string to normalize.
 * @returns string - The normalized ISBN string.
 */
export function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, '').trim();
}
```

---

#### 3. Verifier

The verifier checks if the ISBN exists using external APIs. For example, you can use the **Open Library API**.

```typescript
/**
 * Verifies an ISBN using the Open Library API.
 * @param isbn - The ISBN to verify.
 * @returns Promise<boolean> - True if the ISBN exists, false otherwise.
 */
export async function verifyISBN(isbn: string): Promise<boolean> {
  const normalizedISBN = normalizeISBN(isbn);

  try {
    const response = await fetch(
      `https://openlibrary.org/isbn/${encodeURIComponent(normalizedISBN)}.json`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

---

#### 4. Example Usage

```typescript
import { validateISBN, normalizeISBN, verifyISBN } from './isbnUtils.ts';

const isbn = "978-3-16-148410-0";

// Validate
const isValid = validateISBN(isbn);
console.log(`Is valid: ${isValid}`);

// Normalize
const normalized = normalizeISBN(isbn);
console.log(`Normalized ISBN: ${normalized}`);

// Verify
verifyISBN(normalized).then((exists) => {
  console.log(`ISBN exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

1. **ISBN Format**:
   - The ISBN standard itself is not subject to copyright and can be implemented freely.

2. **Checksum Algorithm**:
   - The algorithms for ISBN-10 and ISBN-13 are in the public domain.

3. **API Usage**:
   - If you use APIs like **Open Library**, comply with their [terms of service](https://openlibrary.org/publishers) or relevant usage policies.
   - Provide attribution where required (e.g., mention that Open Library was used for ISBN verification).

4. **Open Source Licensing**:
   - If you redistribute your code, consider including a permissive license (e.g., MIT or Apache 2.0).

This implementation adheres to ISBN standards while allowing for validation, normalization, and optional verification with external services.

## 2. How do I write a validator, verifier and normalize functions for ISSN in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

To create a **validator**, **verifier**, and **normalize functions** for **ISSN (International Standard Serial Number)** in **Deno** and **TypeScript**, follow these steps:

---

### Overview of ISSN

- **ISSN Format**: `XXXX-XXXX`
  - Exactly 8 digits split by a hyphen.
  - May include an "X" as a check digit for validation.
- **Validation**: Uses a checksum algorithm to ensure correctness.
- **Normalization**: Removes extraneous characters (e.g., spaces or invalid separators).
- **Verification**: Checks against external databases like the ISSN Portal.

---

### Implementation in TypeScript

#### 1. Validator

The ISSN validator ensures:
- The format conforms to `XXXX-XXXX`.
- The checksum is valid.

```typescript
/**
 * Validates the checksum of an ISSN.
 * @param issn - The normalized ISSN string (without hyphen).
 * @returns boolean - True if valid, otherwise false.
 */
function validateISSNChecksum(issn: string): boolean {
  if (issn.length !== 8) return false;

  const digits = issn.slice(0, 7);
  const checkDigit = issn[7].toUpperCase();

  const checksum =
    digits
      .split('')
      .reduce((sum, char, index) => sum + parseInt(char) * (8 - index), 0) %
    11;

  const expectedCheckDigit = checksum === 0 ? '0' : checksum === 1 ? 'X' : `${11 - checksum}`;
  return checkDigit === expectedCheckDigit;
}

/**
 * Validates the format and checksum of an ISSN.
 * @param issn - The ISSN string to validate.
 * @returns boolean - True if the ISSN is valid, otherwise false.
 */
export function validateISSN(issn: string): boolean {
  const normalizedISSN = normalizeISSN(issn);
  if (!/^\d{7}[0-9X]$/.test(normalizedISSN)) return false;
  return validateISSNChecksum(normalizedISSN);
}
```

---

#### 2. Normalizer

The normalizer ensures the ISSN has a consistent format, removing invalid characters (e.g., spaces or extra hyphens).

```typescript
/**
 * Normalizes an ISSN by removing spaces, invalid characters, and ensuring uppercase.
 * @param issn - The ISSN string to normalize.
 * @returns string - The normalized ISSN string (without hyphen).
 */
export function normalizeISSN(issn: string): string {
  return issn.replace(/[^0-9X]/gi, '').toUpperCase();
}
```

---

#### 3. Verifier

The verifier checks the ISSN against an external database like the **ISSN Portal** (if publicly accessible).

Example: Querying the ISSN Portal's API.

```typescript
/**
 * Verifies an ISSN using an external database (e.g., ISSN Portal).
 * @param issn - The ISSN string to verify.
 * @returns Promise<boolean> - True if the ISSN exists, otherwise false.
 */
export async function verifyISSN(issn: string): Promise<boolean> {
  const normalizedISSN = normalizeISSN(issn);

  try {
    const response = await fetch(
      `https://portal.issn.org/api/issn/${encodeURIComponent(normalizedISSN)}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

---

#### 4. Example Usage

```typescript
import { validateISSN, normalizeISSN, verifyISSN } from './issnUtils.ts';

const issn = "2049-3630";

// Validate
const isValid = validateISSN(issn);
console.log(`Is valid: ${isValid}`);

// Normalize
const normalized = normalizeISSN(issn);
console.log(`Normalized ISSN: ${normalized}`);

// Verify
verifyISSN(normalized).then((exists) => {
  console.log(`ISSN exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **ISSN Format**
   - The ISSN standard is a globally recognized public standard and does not require attribution to implement its validation or normalization logic.

#### 2. **Checksum Algorithm**
   - The checksum calculation for ISSN is part of the public domain.

#### 3. **API Usage**
   - If you use the **ISSN Portal API**, follow their terms of service. For example:
     - Attribution may be required.
     - Respect API usage limits or licensing agreements.

#### 4. **Open Source Licensing**
   - If redistributing your code:
     - Use a permissive license (e.g., MIT or Apache 2.0).
     - Attribute external libraries, if any, used in your implementation.

By following these steps, you’ll have a robust system to validate, verify, and normalize ISSNs in compliance with relevant standards and licensing requirements.

## 3. How do I write a validator, verifier (via CrossRef and DataCite) and normalize functions for DOI in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

To create **validator**, **verifier**, and **normalize functions** for **DOI (Digital Object Identifier)** in **Deno** and **TypeScript**, follow these steps:

---

### DOI Overview

- A DOI is a unique alphanumeric string used to identify digital content. 
- It typically follows this format: `10.<registrant_code>/<suffix>`, e.g., `10.1000/182`.
- The prefix `10.` is mandatory, and the suffix can contain alphanumeric characters and symbols.
- **Validation** checks format and characters.
- **Normalization** ensures consistent formatting.
- **Verification** checks the DOI against services like **CrossRef** and **DataCite**.

---

### Implementation

#### 1. Validator

The validator ensures the DOI:
- Starts with `10.`.
- Has a valid structure and allowed characters.

```typescript
/**
 * Validates the format of a DOI.
 * @param doi - The DOI string to validate.
 * @returns boolean - True if the DOI is valid, otherwise false.
 */
export function validateDOI(doi: string): boolean {
  const normalizedDOI = normalizeDOI(doi);
  const doiRegex = /^10\.\d{4,9}\/[^\s]+$/;
  return doiRegex.test(normalizedDOI);
}
```

---

#### 2. Normalizer

The normalizer ensures:
- Removes extraneous characters (like spaces or incorrect schemes like `doi:`).
- Converts the DOI to lowercase for consistency.

```typescript
/**
 * Normalizes a DOI by removing extraneous characters and enforcing lowercase.
 * @param doi - The DOI string to normalize.
 * @returns string - The normalized DOI string.
 */
export function normalizeDOI(doi: string): string {
  return doi.trim().replace(/^doi:\s*/i, '').toLowerCase();
}
```

---

#### 3. Verifier (via CrossRef and DataCite APIs)

Use CrossRef or DataCite APIs to check if a DOI exists and is resolvable.

##### Example: CrossRef Verification

CrossRef has an API to query DOIs and metadata.

```typescript
/**
 * Verifies a DOI using the CrossRef API.
 * @param doi - The DOI string to verify.
 * @returns Promise<boolean> - True if the DOI exists, otherwise false.
 */
export async function verifyDOIWithCrossRef(doi: string): Promise<boolean> {
  const normalizedDOI = normalizeDOI(doi);
  try {
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(normalizedDOI)}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

##### Example: DataCite Verification

DataCite also provides an API for DOI verification.

```typescript
/**
 * Verifies a DOI using the DataCite API.
 * @param doi - The DOI string to verify.
 * @returns Promise<boolean> - True if the DOI exists, otherwise false.
 */
export async function verifyDOIWithDataCite(doi: string): Promise<boolean> {
  const normalizedDOI = normalizeDOI(doi);
  try {
    const response = await fetch(
      `https://api.datacite.org/dois/${encodeURIComponent(normalizedDOI)}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

---

#### 4. Example Usage

```typescript
import {
  validateDOI,
  normalizeDOI,
  verifyDOIWithCrossRef,
  verifyDOIWithDataCite,
} from './doiUtils.ts';

const doi = "DOI: 10.1000/xyz123";

// Validate
const isValid = validateDOI(doi);
console.log(`Is valid DOI: ${isValid}`);

// Normalize
const normalized = normalizeDOI(doi);
console.log(`Normalized DOI: ${normalized}`);

// Verify with CrossRef
verifyDOIWithCrossRef(normalized).then((exists) => {
  console.log(`DOI exists in CrossRef: ${exists}`);
});

// Verify with DataCite
verifyDOIWithDataCite(normalized).then((exists) => {
  console.log(`DOI exists in DataCite: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. DOI Specification
- The DOI system and specification are **standards** and are publicly accessible, so no copyright applies to validating or normalizing DOI formats.

#### 2. API Usage
- **CrossRef API**:
  - CrossRef provides free API access for DOI metadata queries.
  - Respect their [terms of use](https://www.crossref.org/services/metadata-delivery/rest-api/), including rate limits.
  - Attribution is not required for simple lookups, but helpful in metadata-heavy integrations.
- **DataCite API**:
  - DataCite provides API access for DOI queries. 
  - Review their [API terms](https://support.datacite.org/docs/api).

#### 3. Open Source Licensing
- If redistributing your code, consider using an open-source license such as MIT or Apache 2.0.
- Attribute any external libraries or codebases you adapt for your implementation.

By implementing these functions, you’ll have a robust system for DOI validation, normalization, and verification that adheres to the DOI standard and integrates with CrossRef and DataCite services.

## 4. How do I write a validator, verifier and normalize functions for ISNI in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing a Validator, Verifier, and Normalize Functions for ISNI in Deno and TypeScript

**ISNI (International Standard Name Identifier)** is a 16-digit identifier used to uniquely identify names of individuals or organizations. Its structure and validation rely on specific standards like the ISO 27729.

---

### ISNI Overview

1. **Format**:
   - ISNI is a 16-digit numeric identifier, e.g., `0000 0001 2103 2683`.
   - Digits are often grouped into four sets of four for readability.
   - A checksum digit (last digit) is calculated using the ISO/IEC 7064 Mod 11-2 algorithm.

2. **Validation**:
   - Check the length (16 characters, including spaces).
   - Ensure the checksum is correct.

3. **Normalization**:
   - Remove spaces or formatting characters (e.g., hyphens).
   - Output in a consistent format.

4. **Verification**:
   - Cross-check the ISNI against the official ISNI Registry API.

---

### Implementation in TypeScript

#### 1. Validator

The validator ensures that:
- The ISNI has the correct format.
- The checksum is valid.

```typescript
/**
 * Validates the checksum of an ISNI using the Mod 11-2 algorithm.
 * @param isni - The normalized ISNI string (16 digits).
 * @returns boolean - True if the checksum is valid, otherwise false.
 */
function validateISNIChecksum(isni: string): boolean {
  const digits = isni.slice(0, 15).split('').map(Number);
  const checksumDigit = parseInt(isni[15]);

  let sum = 0;
  let multiplier = 2;

  for (let i = digits.length - 1; i >= 0; i--) {
    sum += digits[i] * multiplier;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  const remainder = sum % 11;
  const expectedChecksum = (12 - remainder) % 11;

  return expectedChecksum === checksumDigit;
}

/**
 * Validates an ISNI for format and checksum correctness.
 * @param isni - The ISNI string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateISNI(isni: string): boolean {
  const normalizedISNI = normalizeISNI(isni);
  if (!/^\d{16}$/.test(normalizedISNI)) return false;
  return validateISNIChecksum(normalizedISNI);
}
```

---

#### 2. Normalizer

The normalizer ensures:
- Removes all non-numeric characters.
- Outputs a consistent format (16 digits).

```typescript
/**
 * Normalizes an ISNI by removing spaces and non-numeric characters.
 * @param isni - The ISNI string to normalize.
 * @returns string - The normalized ISNI string (16 digits).
 */
export function normalizeISNI(isni: string): string {
  return isni.replace(/\D/g, '');
}
```

---

#### 3. Verifier

Use the **ISNI Registry API** to check if the ISNI exists in the official database.

```typescript
/**
 * Verifies an ISNI using the ISNI Registry API.
 * @param isni - The ISNI string to verify.
 * @returns Promise<boolean> - True if the ISNI exists, otherwise false.
 */
export async function verifyISNI(isni: string): Promise<boolean> {
  const normalizedISNI = normalizeISNI(isni);

  try {
    const response = await fetch(
      `https://isni.org/isni/${encodeURIComponent(normalizedISNI)}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

---

#### 4. Example Usage

```typescript
import { validateISNI, normalizeISNI, verifyISNI } from './isniUtils.ts';

const isni = "0000 0001 2103 2683";

// Validate
const isValid = validateISNI(isni);
console.log(`Is valid ISNI: ${isValid}`);

// Normalize
const normalized = normalizeISNI(isni);
console.log(`Normalized ISNI: ${normalized}`);

// Verify
verifyISNI(normalized).then((exists) => {
  console.log(`ISNI exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **ISNI Specification**
- The ISNI standard is public, so there are no restrictions on implementing validation or normalization.
- The checksum algorithm (ISO/IEC 7064 Mod 11-2) is also in the public domain.

#### 2. **API Usage**
- The **ISNI Registry API**:
  - If using the official API, comply with their terms of service.
  - Typically, attribution or acknowledgment may be required when integrating their API.
  - Avoid exceeding API usage limits or performing unauthorized scraping.

#### 3. **Redistributing Your Code**
- Use a permissive license like MIT or Apache 2.0 if publishing your implementation.
- Attribute any libraries or external resources used (if applicable).

---

By implementing these functions, you’ll have a complete system to validate, verify, and normalize ISNIs, ensuring compliance with the ISNI standard and enabling interoperability with official services.

## 5. How do I write a validator, verifier and normalize functions for ORCID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

Creating a validator, verifier, and normalizer for ORCID (Open Researcher and Contributor ID) in Deno and TypeScript involves a few steps:

1. **Understand the ORCID structure:**  
   ORCID IDs are 16-character strings in the format `0000-0002-1825-0097`. They:
   - Comply with the ISO 7064 Mod 11-2 standard for checksum verification.
   - Consist of four groups of four digits separated by hyphens.
   - Have a checksum digit that can be 0–9 or "X".

2. **Functions:**
   - **Validator**: Checks if the input matches the ORCID format.
   - **Verifier**: Ensures the checksum is valid using the Mod 11-2 algorithm.
   - **Normalizer**: Converts input (e.g., with extra spaces or without hyphens) to a standard format.

---

### Code Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given ORCID matches the format.
 * @param orcid - The ORCID to validate.
 * @returns boolean - `true` if the ORCID matches the format, otherwise `false`.
 */
export function validateORCID(orcid: string): boolean {
  const orcidRegex = /^(\d{4}-\d{4}-\d{4}-\d{3}[\dX])$/;
  return orcidRegex.test(orcid);
}

/**
 * Verifies the checksum of the given ORCID using Mod 11-2 algorithm.
 * @param orcid - The ORCID to verify.
 * @returns boolean - `true` if the checksum is valid, otherwise `false`.
 */
export function verifyORCID(orcid: string): boolean {
  // Remove hyphens for processing
  const normalizedOrcid = orcid.replace(/-/g, '');
  if (normalizedOrcid.length !== 16) return false;

  const baseDigits = normalizedOrcid.slice(0, 15);
  const checksumChar = normalizedOrcid[15];
  const checksum = checksumChar === 'X' ? 10 : parseInt(checksumChar, 10);

  let total = 0;
  for (const digit of baseDigits) {
    total = (total + parseInt(digit, 10)) * 2;
  }
  const calculatedChecksum = (12 - (total % 11)) % 11;

  return calculatedChecksum === checksum;
}

/**
 * Normalizes the given ORCID by removing extra spaces and formatting with hyphens.
 * @param orcid - The ORCID to normalize.
 * @returns string | null - The normalized ORCID or `null` if the input is invalid.
 */
export function normalizeORCID(orcid: string): string | null {
  const cleanedOrcid = orcid.replace(/\s+/g, '').replace(/-/g, '');
  if (cleanedOrcid.length !== 16 || !/^\d{15}[\dX]$/.test(cleanedOrcid)) {
    return null;
  }
  return `${cleanedOrcid.slice(0, 4)}-${cleanedOrcid.slice(4, 8)}-${cleanedOrcid.slice(8, 12)}-${cleanedOrcid.slice(12)}`;
}
```

---

### Usage Example

```typescript
import { validateORCID, verifyORCID, normalizeORCID } from './orcidUtils.ts';

const input = '0000-0002-1825-0097';

if (validateORCID(input)) {
  if (verifyORCID(input)) {
    console.log('Valid ORCID:', normalizeORCID(input));
  } else {
    console.log('Invalid ORCID checksum.');
  }
} else {
  console.log('Invalid ORCID format.');
}
```

---

### Copyright and Attribution Requirements

The ORCID identifier structure and checksum algorithm are publicly documented, and you can implement them without requiring specific copyright permissions. However, here are some guidelines:

1. **Algorithm Documentation**: If your implementation references or is based on ORCID's documentation, it's good practice to credit ORCID in comments/documentation.
2. **Open Source Licensing**: If you plan to distribute your code, choose an appropriate open-source license (e.g., MIT, Apache 2.0). Clearly mention that the ORCID specification is publicly available and cite the ORCID website (https://orcid.org/).
3. **Trademarks**: The ORCID logo and name are trademarked. Ensure your implementation does not mislead users into thinking it is officially endorsed by ORCID unless you have explicit permission.

For more information on ORCID's policies, consult their [terms and conditions](https://info.orcid.org/terms-and-conditions/).

## 6. How do I write a validator, verifier and normalize functions for ROR in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for ROR (Research Organization Registry)

#### Understanding ROR IDs

- **Format**: ROR IDs are in the format `https://ror.org/<ROR-ID>`, where `<ROR-ID>` is a 9-character alphanumeric string with a checksum character.
- **Structure**:
  - Starts with `https://ror.org/`.
  - `<ROR-ID>` is a 9-character string consisting of 8 base-32 alphanumeric characters followed by a checksum.

ROR uses a variation of the **ISO 7064 Mod 37-2** algorithm for checksum verification.

---

### Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given ROR matches the format.
 * @param ror - The ROR to validate.
 * @returns boolean - `true` if the ROR matches the format, otherwise `false`.
 */
export function validateROR(ror: string): boolean {
  const rorRegex = /^https:\/\/ror\.org\/([0-9a-z]{9})$/i;
  return rorRegex.test(ror);
}

/**
 * Verifies the checksum of the given ROR ID using Mod 37-2 algorithm.
 * @param ror - The ROR to verify.
 * @returns boolean - `true` if the checksum is valid, otherwise `false`.
 */
export function verifyROR(ror: string): boolean {
  const rorRegex = /^https:\/\/ror\.org\/([0-9a-z]{9})$/i;
  const match = ror.match(rorRegex);

  if (!match) return false;

  const rorId = match[1];
  const baseChars = rorId.slice(0, 8);
  const checksumChar = rorId[8];

  const mod37Charset = '0123456789abcdefghijklmnopqrstuvwxyz';

  // Calculate checksum
  let total = 0;
  for (const char of baseChars) {
    total = (total + mod37Charset.indexOf(char.toLowerCase())) % 37;
    total *= 2;
  }
  const calculatedChecksum = mod37Charset[(total % 37)];

  return calculatedChecksum === checksumChar.toLowerCase();
}

/**
 * Normalizes the given ROR by ensuring the correct URL format.
 * @param ror - The ROR to normalize.
 * @returns string | null - The normalized ROR URL or `null` if the input is invalid.
 */
export function normalizeROR(ror: string): string | null {
  const rorRegex = /^[0-9a-z]{9}$/i;

  if (rorRegex.test(ror)) {
    return `https://ror.org/${ror}`;
  }

  const match = ror.match(/^https:\/\/ror\.org\/([0-9a-z]{9})$/i);
  return match ? `https://ror.org/${match[1]}` : null;
}
```

---

### Usage Example

```typescript
import { validateROR, verifyROR, normalizeROR } from './rorUtils.ts';

const input = 'https://ror.org/03yrm5c26';

if (validateROR(input)) {
  if (verifyROR(input)) {
    console.log('Valid ROR:', normalizeROR(input));
  } else {
    console.log('Invalid ROR checksum.');
  }
} else {
  console.log('Invalid ROR format.');
}
```

---

### Copyright and Attribution Requirements

#### **Using ROR Specifications**

The ROR organization provides the format and checksum algorithm as part of its public documentation. You can freely implement this functionality in your code without explicit permissions. However:

1. **Credit and Attribution**:
   - Acknowledge the ROR project in your comments or documentation if the implementation is based on their public specifications.
   - Include a link to the [ROR website](https://ror.org/) as a reference for users.

2. **Open Source Considerations**:
   - If redistributing the code, use a permissive open-source license (e.g., MIT, Apache 2.0) and clarify that ROR specifications are used.
   - Avoid misleading users about endorsements or official connections unless you have explicit permission from ROR.

3. **Trademark Notes**:
   - The name "ROR" and its logo are trademarks of the ROR project. Do not imply official affiliation unless authorized.

For further details, consult the [ROR Terms and Conditions](https://ror.org/terms).

## 7. How do I write a validator, verifier and normalize functions for ISTC (International Standard Text Code) in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for ISTC (International Standard Text Code)

#### Understanding ISTC

- **Format**: ISTC is a 16-character alphanumeric identifier divided into four groups of four characters, separated by hyphens (e.g., `ABCD-1234-5678-EFGH`).
- **Structure**:
  - Each ISTC consists of uppercase alphanumeric characters (A–Z, 0–9).
  - A checksum ensures validity, calculated using the ISO 7064 Mod 11-2 algorithm.

---

### Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given ISTC matches the standard format.
 * @param istc - The ISTC to validate.
 * @returns boolean - `true` if the ISTC matches the format, otherwise `false`.
 */
export function validateISTC(istc: string): boolean {
  const istcRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return istcRegex.test(istc);
}

/**
 * Verifies the checksum of the given ISTC using the Mod 11-2 algorithm.
 * @param istc - The ISTC to verify.
 * @returns boolean - `true` if the checksum is valid, otherwise `false`.
 */
export function verifyISTC(istc: string): boolean {
  // Remove hyphens for checksum calculation
  const normalizedIstc = istc.replace(/-/g, '');
  if (normalizedIstc.length !== 16) return false;

  const baseChars = normalizedIstc.slice(0, 15);
  const checksumChar = normalizedIstc[15];

  let total = 0;
  for (const char of baseChars) {
    const value = isNaN(Number(char)) ? char.charCodeAt(0) - 55 : parseInt(char, 10);
    total = (total + value) * 2;
  }
  const remainder = total % 11;
  const calculatedChecksum = (12 - remainder) % 11;

  const expectedChecksum = calculatedChecksum === 10 ? 'X' : calculatedChecksum.toString();

  return checksumChar === expectedChecksum;
}

/**
 * Normalizes the given ISTC by removing extra spaces and formatting with hyphens.
 * @param istc - The ISTC to normalize.
 * @returns string | null - The normalized ISTC or `null` if the input is invalid.
 */
export function normalizeISTC(istc: string): string | null {
  const cleanedIstc = istc.replace(/\s+/g, '').replace(/-/g, '').toUpperCase();
  if (cleanedIstc.length !== 16 || !/^[A-Z0-9]{16}$/.test(cleanedIstc)) {
    return null;
  }
  return `${cleanedIstc.slice(0, 4)}-${cleanedIstc.slice(4, 8)}-${cleanedIstc.slice(8, 12)}-${cleanedIstc.slice(12)}`;
}
```

---

### Usage Example

```typescript
import { validateISTC, verifyISTC, normalizeISTC } from './istcUtils.ts';

const input = 'ABCD-1234-5678-EFGH';

if (validateISTC(input)) {
  if (verifyISTC(input)) {
    console.log('Valid ISTC:', normalizeISTC(input));
  } else {
    console.log('Invalid ISTC checksum.');
  }
} else {
  console.log('Invalid ISTC format.');
}
```

---

### Copyright and Attribution Requirements

#### **Using ISTC Specifications**

The ISTC (International Standard Text Code) is defined in public standards documentation, specifically ISO 21047. The algorithm for the checksum (ISO 7064 Mod 11-2) is also a publicly available specification.

1. **Credit and Attribution**:
   - Mention that your implementation adheres to the ISTC standard and uses the ISO 7064 checksum algorithm.
   - Provide a reference to the ISTC website or the ISO 21047 standard in your documentation.

2. **Open Source Licensing**:
   - Use an open-source license like MIT, Apache 2.0, or similar when redistributing your code.
   - State that your code implements publicly available specifications and does not require proprietary permissions.

3. **Trademark Notes**:
   - The ISTC name may be trademarked in some jurisdictions. Avoid implying official endorsement unless authorized by the ISTC governing body.

For further clarification, consult the ISTC guidelines or governing body.

## 8. How do I write a validator, verifier and normalize functions for handle identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for Handle Identifiers in Deno and TypeScript

#### Understanding Handle Identifiers

Handle identifiers are unique and persistent identifiers for digital objects, such as `10.12345/abcde`.

- **Format**:
  - Composed of a prefix and a suffix separated by `/`.
  - Prefix: Typically numeric, representing the namespace or registrant (e.g., `10.12345`).
  - Suffix: Alphanumeric, identifying the specific object (e.g., `abcde`).
- **Structure**:
  - Follows the general pattern: `<prefix>/<suffix>` where:
    - `<prefix>` is one or more digits followed by a period and more digits.
    - `<suffix>` can contain alphanumeric characters, hyphens, dots, or underscores.

#### Functions

1. **Validator**: Ensures the identifier matches the standard format.
2. **Verifier**: Optionally, you could implement a resolution check to verify if the handle exists, though this requires querying the Handle System or a specific resolver like `doi.org`.
3. **Normalizer**: Standardizes the identifier by trimming spaces and ensuring consistent casing (if applicable).

---

### Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given Handle Identifier matches the standard format.
 * @param handle - The Handle Identifier to validate.
 * @returns boolean - `true` if the Handle Identifier matches the format, otherwise `false`.
 */
export function validateHandle(handle: string): boolean {
  const handleRegex = /^\d+\.\d+\/[\w.\-]+$/;
  return handleRegex.test(handle);
}

/**
 * Verifies the given Handle Identifier by checking its format and optionally resolving it.
 * @param handle - The Handle Identifier to verify.
 * @returns boolean - `true` if the Handle Identifier is valid and resolvable, otherwise `false`.
 */
export async function verifyHandle(handle: string): Promise<boolean> {
  if (!validateHandle(handle)) {
    return false;
  }

  // Optionally, resolve the handle using an HTTP request (e.g., via `doi.org` for DOIs).
  try {
    const response = await fetch(`https://hdl.handle.net/${handle}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes the given Handle Identifier by trimming spaces and ensuring consistent casing.
 * @param handle - The Handle Identifier to normalize.
 * @returns string | null - The normalized Handle Identifier or `null` if the input is invalid.
 */
export function normalizeHandle(handle: string): string | null {
  const trimmedHandle = handle.trim();
  if (!validateHandle(trimmedHandle)) {
    return null;
  }
  return trimmedHandle.toLowerCase();
}
```

---

### Usage Example

```typescript
import { validateHandle, verifyHandle, normalizeHandle } from './handleUtils.ts';

const input = ' 10.12345/abcde ';

if (validateHandle(input)) {
  verifyHandle(input).then((isValid) => {
    if (isValid) {
      console.log('Valid Handle Identifier:', normalizeHandle(input));
    } else {
      console.log('Handle Identifier cannot be resolved.');
    }
  });
} else {
  console.log('Invalid Handle Identifier format.');
}
```

---

### Copyright and Attribution Requirements

#### **Using Handle System Specifications**

The Handle System, including its format and resolution methods, is an open standard managed by the Corporation for National Research Initiatives (CNRI). Implementing functions for Handle Identifiers does not require specific permissions, but you should consider the following:

1. **Credit and Attribution**:
   - Acknowledge the Handle System in your comments or documentation.
   - Provide a reference to the Handle System website ([handle.net](https://handle.net)) for more information.

2. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) for your code.
   - Clarify that your implementation follows publicly documented standards and does not infringe proprietary rights.

3. **Trademark Notes**:
   - The term "Handle System" and related terms may be trademarked by CNRI. Avoid implying endorsement or affiliation unless authorized.

#### Optional: Verifying Resolution

If your implementation relies on querying a resolver like `hdl.handle.net` or `doi.org`, ensure compliance with their terms of service. Always cache responses appropriately to reduce load on their servers.

## 9. How do I write a validator, verifier and normalize functions for EAN (International Article Number (EAN-13 or EAN-8)) in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for EAN (EAN-13 and EAN-8)

#### Understanding EAN

EAN (European Article Number) is a barcode standard widely used in retail. Common formats include:
- **EAN-13**: 13 digits.
- **EAN-8**: 8 digits.

EANs use a checksum to validate the number's integrity. The checksum is calculated using a weighted sum of the digits and the Mod 10 algorithm.

---

### Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given number matches the EAN-13 or EAN-8 format.
 * @param ean - The EAN to validate.
 * @returns boolean - `true` if the EAN matches the format, otherwise `false`.
 */
export function validateEAN(ean: string): boolean {
  const eanRegex = /^\d{8}$|^\d{13}$/;
  return eanRegex.test(ean);
}

/**
 * Verifies the checksum of the given EAN using the Mod 10 algorithm.
 * @param ean - The EAN to verify.
 * @returns boolean - `true` if the checksum is valid, otherwise `false`.
 */
export function verifyEAN(ean: string): boolean {
  if (!validateEAN(ean)) {
    return false;
  }

  const digits = ean.split('').map(Number);
  const length = digits.length;

  // Calculate checksum using Mod 10
  const checksum = digits
    .slice(0, length - 1)
    .reduce((sum, digit, index) => {
      const weight = length === 13 ? (index % 2 === 0 ? 1 : 3) : (index % 2 === 0 ? 3 : 1);
      return sum + digit * weight;
    }, 0);

  const calculatedChecksum = (10 - (checksum % 10)) % 10;
  return calculatedChecksum === digits[length - 1];
}

/**
 * Normalizes the given EAN by removing non-numeric characters and trimming spaces.
 * @param ean - The EAN to normalize.
 * @returns string | null - The normalized EAN or `null` if the input is invalid.
 */
export function normalizeEAN(ean: string): string | null {
  const cleanedEan = ean.replace(/\D/g, '').trim();
  return validateEAN(cleanedEan) ? cleanedEan : null;
}
```

---

### Usage Example

```typescript
import { validateEAN, verifyEAN, normalizeEAN } from './eanUtils.ts';

const input = '4006381333931'; // Example EAN-13

if (validateEAN(input)) {
  if (verifyEAN(input)) {
    console.log('Valid EAN:', normalizeEAN(input));
  } else {
    console.log('Invalid EAN checksum.');
  }
} else {
  console.log('Invalid EAN format.');
}
```

---

### How It Works

1. **Validator**:
   - Ensures the input is a numeric string of length 8 (EAN-8) or 13 (EAN-13).
2. **Verifier**:
   - Computes the checksum using the Mod 10 algorithm:
     - Multiply alternating digits by weights of 1 and 3.
     - Sum the results, compute the remainder when divided by 10, and subtract from 10.
   - Compares the calculated checksum to the last digit of the input.
3. **Normalizer**:
   - Removes non-numeric characters and trims spaces to produce a clean EAN string.

---

### Copyright and Attribution Requirements

#### **Using EAN Standards**

The EAN system is a publicly documented standard maintained by GS1. Writing functions to validate, verify, and normalize EANs does not require explicit permission. However, follow these guidelines:

1. **Credit and Attribution**:
   - Mention in your comments or documentation that your implementation adheres to the EAN/GS1 standards.
   - Reference the GS1 website ([gs1.org](https://www.gs1.org)) for additional information.

2. **Open Source Licensing**:
   - Use an open-source license (e.g., MIT, Apache 2.0) if you distribute the code.
   - Clarify that your implementation is based on publicly documented standards.

3. **Trademarks**:
   - The term "EAN" and related terms are associated with GS1. Avoid using their trademarks in ways that imply endorsement or official affiliation unless explicitly authorized.

For more details, refer to GS1's [terms and conditions](https://www.gs1.org/terms-conditions).

## 10. How do I write a validator, verifier and normalize functions for URL in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for URLs in Deno and TypeScript

#### URLs Overview

A URL (Uniform Resource Locator) follows a specific syntax defined by the IETF in [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). To handle URLs effectively, the validation should check structure and scheme, the verification should optionally check resolution, and normalization should standardize case and structure.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a properly formatted URL.
 * @param url - The string to validate.
 * @returns boolean - `true` if the string is a valid URL, otherwise `false`.
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url); // Built-in URL constructor
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifies if the URL is resolvable by sending a HEAD request.
 * @param url - The URL to verify.
 * @returns Promise<boolean> - `true` if the URL is resolvable, otherwise `false`.
 */
export async function verifyURL(url: string): Promise<boolean> {
  if (!validateURL(url)) {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by resolving its components and standardizing its structure.
 * @param url - The URL to normalize.
 * @returns string | null - The normalized URL or `null` if the input is invalid.
 */
export function normalizeURL(url: string): string | null {
  try {
    const parsedURL = new URL(url.trim());
    // Convert hostname to lowercase and remove default port (if any)
    parsedURL.hostname = parsedURL.hostname.toLowerCase();
    if ((parsedURL.protocol === 'http:' && parsedURL.port === '80') ||
        (parsedURL.protocol === 'https:' && parsedURL.port === '443')) {
      parsedURL.port = '';
    }
    return parsedURL.toString();
  } catch {
    return null;
  }
}
```

---

#### Usage Example

```typescript
import { validateURL, verifyURL, normalizeURL } from './urlUtils.ts';

const input = '  HTTPS://Example.COM:443/some/path?query=1 ';

if (validateURL(input)) {
  verifyURL(input).then((isResolvable) => {
    if (isResolvable) {
      console.log('Valid and resolvable URL:', normalizeURL(input));
    } else {
      console.log('Valid URL, but cannot be resolved.');
    }
  });
} else {
  console.log('Invalid URL format.');
}
```

---

### Explanation

1. **Validator**:
   - Uses the built-in `URL` constructor to check if the input conforms to URL syntax.
   - Handles edge cases such as invalid schemes, missing components, or malformed URLs.

2. **Verifier**:
   - Performs an HTTP `HEAD` request to check if the URL is resolvable.
   - Requires internet access and should handle network errors gracefully.

3. **Normalizer**:
   - Trims extra spaces.
   - Converts the hostname to lowercase (as URLs are case-insensitive except for the path/query/fragment).
   - Removes default ports (`:80` for HTTP, `:443` for HTTPS).
   - Ensures the URL is in its canonical form.

---

### Copyright and Attribution Requirements

1. **Using URL Standards**:
   - The syntax and behavior of URLs are defined in [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) and [WHATWG URL](https://url.spec.whatwg.org/).
   - These standards are public and open, so you can implement functions without requiring specific permission.

2. **Attribution**:
   - Mention in your documentation or comments that the implementation adheres to RFC 3986 or WHATWG URL specifications.
   - Optionally, provide a link to the relevant documentation for user reference.

3. **Open Source Licensing**:
   - If redistributing the code, use a permissive open-source license like MIT, Apache 2.0, or similar.
   - Clarify that the implementation is based on publicly documented URL standards.

4. **Trademarks**:
   - Terms like "URL" are generic and not trademarked. No special permissions are needed to use these terms in your project.

## 11. How do I write a validator, verifier and normalize functions for URI in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for URI in Deno and TypeScript

#### Understanding URI

A URI (Uniform Resource Identifier) is a string that uniquely identifies a resource. It may include a scheme, authority, path, query, and fragment, as defined in [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).

- Examples:
  - **Absolute URI**: `https://example.com/path?query=value`
  - **Relative URI**: `/path?query=value`
  - **URN**: `urn:isbn:0451450523`

---

### Implementation in TypeScript (Deno Compatible)

```typescript
/**
 * Validates if the given string is a well-formed URI.
 * @param uri - The string to validate.
 * @returns boolean - `true` if the string is a valid URI, otherwise `false`.
 */
export function validateURI(uri: string): boolean {
  const uriRegex = /^[a-zA-Z][a-zA-Z0-9+.-]*:(\/\/)?[^\s]*$/; // Matches most URI patterns
  return uriRegex.test(uri);
}

/**
 * Verifies the URI by resolving it.
 * For absolute URIs, this may involve checking if the resource exists.
 * @param uri - The URI to verify.
 * @returns Promise<boolean> - `true` if the URI is valid and resolvable, otherwise `false`.
 */
export async function verifyURI(uri: string): Promise<boolean> {
  if (!validateURI(uri)) {
    return false;
  }

  // Attempt a network resolution for absolute URIs (like HTTP/HTTPS)
  try {
    if (uri.startsWith('http:') || uri.startsWith('https:')) {
      const response = await fetch(uri, { method: 'HEAD' });
      return response.ok;
    }
    // For other schemes like `urn:`, no verification is possible in this implementation.
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URI by trimming spaces, resolving case sensitivity, and canonicalizing.
 * @param uri - The URI to normalize.
 * @returns string | null - The normalized URI or `null` if the input is invalid.
 */
export function normalizeURI(uri: string): string | null {
  try {
    const parsedURL = new URL(uri.trim());
    // Canonicalize case-sensitive components (e.g., scheme and hostname for HTTP/HTTPS)
    parsedURL.protocol = parsedURL.protocol.toLowerCase();
    parsedURL.hostname = parsedURL.hostname.toLowerCase();

    // Remove default ports (80 for HTTP, 443 for HTTPS)
    if (
      (parsedURL.protocol === 'http:' && parsedURL.port === '80') ||
      (parsedURL.protocol === 'https:' && parsedURL.port === '443')
    ) {
      parsedURL.port = '';
    }
    return parsedURL.toString();
  } catch {
    return validateURI(uri.trim()) ? uri.trim() : null; // Fallback for non-URL URIs
  }
}
```

---

### Usage Example

```typescript
import { validateURI, verifyURI, normalizeURI } from './uriUtils.ts';

const input = '  HTTPS://Example.COM:443/path?query=value ';

if (validateURI(input)) {
  verifyURI(input).then((isResolvable) => {
    if (isResolvable) {
      console.log('Valid and resolvable URI:', normalizeURI(input));
    } else {
      console.log('Valid URI, but cannot be resolved.');
    }
  });
} else {
  console.log('Invalid URI format.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to check if the string follows the basic URI syntax as per RFC 3986.
   - The regex covers absolute URIs, relative URIs, and URNs.

2. **Verifier**:
   - For `http:` and `https:` URIs, performs an HTTP `HEAD` request to check resource availability.
   - For other schemes (like `urn:`), assumes validity since resolution is context-dependent.

3. **Normalizer**:
   - Trims whitespace and resolves case sensitivity issues.
   - Canonicalizes HTTP/HTTPS URLs by lowercasing schemes/hostnames and removing default ports.
   - Falls back to returning a trimmed URI for non-URL URIs.

---

### Copyright and Attribution Requirements

#### **Using URI Standards**

The URI syntax and behavior are defined in publicly available standards like [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) and [WHATWG URL](https://url.spec.whatwg.org/). Implementing code based on these standards is not restricted.

1. **Credit and Attribution**:
   - Acknowledge in your comments or documentation that your implementation follows the URI syntax defined in RFC 3986.
   - Optionally, provide links to the relevant standards.

2. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) when redistributing your code.
   - Clarify that the code is based on publicly available standards and does not include proprietary elements.

3. **Trademarks**:
   - The term "URI" is generic and not trademarked. No special permissions are required to use this term.

## 12. How do I write a validator, verifier and normalize functions for URL in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for URLs in Deno and TypeScript

A **URL (Uniform Resource Locator)** is a specific type of URI that specifies the location of a resource. It follows the structure defined by the [WHATWG URL Standard](https://url.spec.whatwg.org/) and [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). 

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid URL.
 * @param url - The string to validate.
 * @returns boolean - `true` if the string is a valid URL, otherwise `false`.
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url); // Leverages the built-in URL constructor
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifies if a URL is resolvable via a network request.
 * @param url - The URL to verify.
 * @returns Promise<boolean> - `true` if the URL is resolvable, otherwise `false`.
 */
export async function verifyURL(url: string): Promise<boolean> {
  if (!validateURL(url)) {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by resolving and standardizing its components.
 * @param url - The URL to normalize.
 * @returns string | null - The normalized URL or `null` if the input is invalid.
 */
export function normalizeURL(url: string): string | null {
  try {
    const parsedURL = new URL(url.trim());
    // Convert hostname to lowercase
    parsedURL.hostname = parsedURL.hostname.toLowerCase();

    // Remove default ports (if any)
    if ((parsedURL.protocol === 'http:' && parsedURL.port === '80') ||
        (parsedURL.protocol === 'https:' && parsedURL.port === '443')) {
      parsedURL.port = '';
    }

    // Ensure the URL is in canonical form
    return parsedURL.toString();
  } catch {
    return null;
  }
}
```

---

### Usage Example

```typescript
import { validateURL, verifyURL, normalizeURL } from './urlUtils.ts';

const input = '  HTTPS://Example.COM:443/Some/Path?query=value ';

// Validate URL
if (validateURL(input)) {
  console.log('URL format is valid.');

  // Verify URL resolution
  verifyURL(input).then((isResolvable) => {
    if (isResolvable) {
      console.log('URL is resolvable.');
    } else {
      console.log('URL is valid but not resolvable.');
    }
  });

  // Normalize URL
  const normalized = normalizeURL(input);
  console.log('Normalized URL:', normalized);
} else {
  console.log('Invalid URL format.');
}
```

---

### Explanation

1. **Validator**:
   - The `URL` constructor is used to validate URL syntax. If the input is invalid, it throws an error, which is caught and returns `false`.

2. **Verifier**:
   - Performs an HTTP `HEAD` request to check the existence and accessibility of the resource.
   - Handles network errors gracefully with a `try/catch`.

3. **Normalizer**:
   - Standardizes the URL format:
     - Trims spaces.
     - Converts hostname to lowercase (case-insensitive in URLs).
     - Removes default ports for `http` (`:80`) and `https` (`:443`).
   - Returns a canonical version of the URL.

---

### Copyright and Attribution Requirements

#### **Using URL Standards**

1. **Public Standards**:
   - URLs follow publicly available standards defined by [WHATWG](https://url.spec.whatwg.org/) and [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). These are open standards, so you can write code based on them without any restrictions.

2. **Attribution**:
   - It is good practice to include a comment or documentation in your code acknowledging that it follows the WHATWG URL standard or RFC 3986.
   - You can optionally provide links to the relevant specifications.

3. **Open Source Licensing**:
   - Use an open-source license (e.g., MIT, Apache 2.0) if you distribute your code.
   - Mention that your implementation is based on publicly available standards.

4. **Trademarks**:
   - "URL" is a generic term and not trademarked, so no special permissions are needed to use this term in your code or documentation. 

This ensures that your implementation is compliant with attribution and licensing practices while adhering to established URL standards.

## 13. How do I write a validator, verifier and normalize functions for PURL in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for PURL in Deno and TypeScript

#### Understanding PURL

A **PURL (Persistent Uniform Resource Locator)** is a URL that acts as a permanent identifier for a resource. It allows resource locations to change over time while maintaining a consistent identifier. A typical PURL might look like:

- `http://purl.org/example/resource`

PURLs follow standard URL formatting rules, so the `URL` API in TypeScript can handle much of the validation and normalization.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a well-formed PURL.
 * @param purl - The string to validate.
 * @returns boolean - `true` if the string is a valid PURL, otherwise `false`.
 */
export function validatePURL(purl: string): boolean {
  try {
    const url = new URL(purl);
    // Validate that the URL uses the PURL domain or scheme
    return url.hostname.endsWith('purl.org');
  } catch {
    return false;
  }
}

/**
 * Verifies the PURL by checking if it resolves to a resource.
 * @param purl - The PURL to verify.
 * @returns Promise<boolean> - `true` if the PURL is resolvable, otherwise `false`.
 */
export async function verifyPURL(purl: string): Promise<boolean> {
  if (!validatePURL(purl)) {
    return false;
  }

  try {
    const response = await fetch(purl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a PURL by resolving and standardizing its components.
 * @param purl - The PURL to normalize.
 * @returns string | null - The normalized PURL or `null` if the input is invalid.
 */
export function normalizePURL(purl: string): string | null {
  try {
    const parsedURL = new URL(purl.trim());
    // Lowercase hostname for canonicalization
    parsedURL.hostname = parsedURL.hostname.toLowerCase();

    // Remove default ports for HTTP/HTTPS
    if ((parsedURL.protocol === 'http:' && parsedURL.port === '80') ||
        (parsedURL.protocol === 'https:' && parsedURL.port === '443')) {
      parsedURL.port = '';
    }

    return parsedURL.toString();
  } catch {
    return null;
  }
}
```

---

### Usage Example

```typescript
import { validatePURL, verifyPURL, normalizePURL } from './purlUtils.ts';

const input = 'HTTP://PURL.ORG/example/resource';

if (validatePURL(input)) {
  console.log('Valid PURL format.');

  verifyPURL(input).then((isResolvable) => {
    if (isResolvable) {
      console.log('PURL is resolvable:', normalizePURL(input));
    } else {
      console.log('PURL is valid but not resolvable.');
    }
  });
} else {
  console.log('Invalid PURL format.');
}
```

---

### Explanation

1. **Validator**:
   - Checks if the string is a valid URL using the `URL` API.
   - Ensures the URL uses the `purl.org` domain, which is standard for PURLs.

2. **Verifier**:
   - Performs a `HEAD` request to check if the PURL resolves to a resource.
   - Handles network errors gracefully with a `try/catch` block.

3. **Normalizer**:
   - Trims whitespace.
   - Converts the hostname to lowercase to ensure canonical form.
   - Removes default ports for HTTP/HTTPS.
   - Returns a canonical, normalized PURL.

---

### Copyright and Attribution Requirements

1. **Using PURL Standards**:
   - PURLs are based on the [URL specification](https://url.spec.whatwg.org/) and follow its rules. 
   - The concept of PURLs originated from OCLC (Online Computer Library Center) and is public knowledge. There are no restrictions on implementing functions to handle PURLs.

2. **Attribution**:
   - In comments or documentation, mention that your implementation adheres to the URL standards and PURL conventions.
   - Reference the PURL homepage ([http://purl.org/](http://purl.org/)) for more information.

3. **Open Source Licensing**:
   - If redistributing the code, use a permissive license such as MIT or Apache 2.0.
   - Clearly state that the code is based on publicly available URL and PURL standards.

4. **Trademarks**:
   - "PURL" is not trademarked. No special permissions are needed to use the term in your project. 

This approach ensures adherence to standards and provides robust functionality for validating, verifying, and normalizing PURLs.

## 14. How do I write a validator, verifier and normalize functions for ADS bibliographic code in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for ADS Bibliographic Code in Deno and TypeScript

#### Understanding ADS Bibliographic Code

The **ADS Bibliographic Code** is a unique identifier used by the [Astrophysics Data System (ADS)](https://ui.adsabs.harvard.edu/) to reference scientific papers and astronomical data. It has the format:

```
YYYYJJJJJVVVVMPPPPA
```

Where:
- **YYYY**: Year (4 digits)
- **JJJJJ**: Journal abbreviation (up to 5 characters, padded with dots if shorter)
- **VVVV**: Volume number (4 digits, padded with dots if shorter)
- **M**: Publication type (1 character, e.g., "L" for letters, "." for regular articles)
- **PPPPP**: Page number or article number (5 digits, padded with dots if shorter)
- **A**: First letter of the last name of the first author (1 character)

Examples:
- `2024ApJ...123L0001A`
- `1998Natur.123..456B`

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a well-formed ADS Bibliographic Code.
 * @param code - The string to validate.
 * @returns boolean - `true` if the string is valid, otherwise `false`.
 */
export function validateADSCode(code: string): boolean {
  const regex = /^[0-9]{4}[A-Za-z\.]{5}[0-9\.]{4}[A-Za-z\.][0-9\.]{5}[A-Za-z]$/;
  return regex.test(code);
}

/**
 * Verifies an ADS Bibliographic Code by checking its existence via the ADS API.
 * @param code - The ADS Bibliographic Code to verify.
 * @param apiKey - Your ADS API key for authentication.
 * @returns Promise<boolean> - `true` if the code exists, otherwise `false`.
 */
export async function verifyADSCode(code: string, apiKey: string): Promise<boolean> {
  if (!validateADSCode(code)) {
    return false;
  }

  try {
    const response = await fetch(`https://ui.adsabs.harvard.edu/v1/bib/${code}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes an ADS Bibliographic Code by ensuring consistent formatting.
 * @param code - The ADS Bibliographic Code to normalize.
 * @returns string | null - The normalized ADS code or `null` if the input is invalid.
 */
export function normalizeADSCode(code: string): string | null {
  if (!validateADSCode(code)) {
    return null;
  }

  const year = code.slice(0, 4);
  const journal = code.slice(4, 9).padEnd(5, '.');
  const volume = code.slice(9, 13).padEnd(4, '.');
  const type = code[13];
  const page = code.slice(14, 19).padEnd(5, '.');
  const author = code[19];

  return `${year}${journal}${volume}${type}${page}${author}`;
}
```

---

### Usage Example

```typescript
import { validateADSCode, verifyADSCode, normalizeADSCode } from './adsUtils.ts';

const apiKey = 'your_ads_api_key'; // Replace with your ADS API key
const input = '2024ApJ123L0001A';

// Validate ADS Code
if (validateADSCode(input)) {
  console.log('Valid ADS Code format.');

  // Verify ADS Code existence
  verifyADSCode(input, apiKey).then((exists) => {
    if (exists) {
      console.log('ADS Code exists:', normalizeADSCode(input));
    } else {
      console.log('ADS Code does not exist.');
    }
  });
} else {
  console.log('Invalid ADS Code format.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regular expression to ensure the input adheres to the ADS bibliographic code format.
   - Checks each component (year, journal abbreviation, volume, type, page, author) for correct length and format.

2. **Verifier**:
   - Sends a request to the ADS API to verify if the bibliographic code exists in their database.
   - Requires an API key for authentication.
   - Returns `true` if the resource exists, and `false` otherwise.

3. **Normalizer**:
   - Standardizes the code format by padding shorter components with dots as per the ADS format requirements.
   - Ensures consistency across representations of the same bibliographic code.

---

### Copyright and Attribution Requirements

1. **ADS Bibliographic Code Standards**:
   - The ADS bibliographic code format is publicly documented and used in academic and research contexts. No copyright restrictions apply to using this format for validation or utility functions.

2. **Using the ADS API**:
   - The ADS API has usage terms. Ensure you comply with their [API documentation](https://ui.adsabs.harvard.edu/help/api/) and terms of service.
   - Attribution to ADS is typically required when using their API, so include a note in your documentation or code.

3. **Attribution**:
   - Mention in your code or documentation that the implementation follows the ADS bibliographic code format.
   - Provide a link to the [ADS Bibliographic Code description](https://ui.adsabs.harvard.edu/help/actions/bibcodes) for user reference.

4. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) if redistributing your code.
   - Clarify that the implementation is based on publicly available standards.

By adhering to these principles, your implementation will be compliant with both technical and legal standards.

## 15. How do I write a validator, verifier and normalize functions for arXiv ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for arXiv ID in Deno and TypeScript

#### Understanding arXiv ID

The **arXiv ID** is a unique identifier used by the [arXiv](https://arxiv.org) preprint repository to reference papers. It comes in two formats:

1. **Old-style IDs**:
   - Format: `<archive>/<YYMMNNN>` (e.g., `hep-th/9702001`)
   - Used before April 2007.
   - `<archive>` is the subject classification.
   - `<YYMM>` is the two-digit year and two-digit month.
   - `<NNN>` is a sequence number (1-9999).

2. **New-style IDs**:
   - Format: `<YYMM.NNNNN>` (e.g., `2103.00001`)
   - Used after April 2007.
   - `<YYMM>` is the year and month.
   - `<NNNNN>` is a sequence number (1-99999).

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a well-formed arXiv ID.
 * @param id - The string to validate.
 * @returns boolean - `true` if the string is a valid arXiv ID, otherwise `false`.
 */
export function validateArxivID(id: string): boolean {
  const oldStyleRegex = /^[a-z\-]+\/\d{2}(0[1-9]|1[0-2])\d{3,4}$/;
  const newStyleRegex = /^\d{4}\.(\d{4,5})$/;
  return oldStyleRegex.test(id) || newStyleRegex.test(id);
}

/**
 * Verifies if an arXiv ID exists by checking the arXiv API.
 * @param id - The arXiv ID to verify.
 * @returns Promise<boolean> - `true` if the ID exists, otherwise `false`.
 */
export async function verifyArxivID(id: string): Promise<boolean> {
  if (!validateArxivID(id)) {
    return false;
  }

  try {
    const response = await fetch(`https://arxiv.org/abs/${id}`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes an arXiv ID by trimming spaces and standardizing the format.
 * @param id - The arXiv ID to normalize.
 * @returns string | null - The normalized arXiv ID or `null` if the input is invalid.
 */
export function normalizeArxivID(id: string): string | null {
  if (!validateArxivID(id)) {
    return null;
  }

  return id.trim().toLowerCase();
}
```

---

### Usage Example

```typescript
import { validateArxivID, verifyArxivID, normalizeArxivID } from './arxivUtils.ts';

const input = ' hep-th/9702001 ';

if (validateArxivID(input)) {
  console.log('Valid arXiv ID format.');

  verifyArxivID(input).then((exists) => {
    if (exists) {
      console.log('arXiv ID exists:', normalizeArxivID(input));
    } else {
      console.log('arXiv ID does not exist.');
    }
  });
} else {
  console.log('Invalid arXiv ID format.');
}
```

---

### Explanation

1. **Validator**:
   - Uses two regular expressions to handle old-style and new-style arXiv IDs.
   - Ensures the format adheres to the conventions set by arXiv.

2. **Verifier**:
   - Sends a `GET` request to the arXiv website (e.g., `https://arxiv.org/abs/<id>`).
   - If the response status is `200`, the ID is valid and exists.

3. **Normalizer**:
   - Trims whitespace and converts the ID to lowercase for consistency.
   - Does not modify the structure of the ID.

---

### Copyright and Attribution Requirements

1. **arXiv ID Standards**:
   - The arXiv ID format is publicly documented and widely used in academic contexts. There are no copyright restrictions on implementing functions to handle these IDs.

2. **Using the arXiv Website/API**:
   - Accessing the arXiv website for verification purposes is permissible under their [Terms of Use](https://arxiv.org/terms-of-use).
   - You can cite arXiv in your documentation as the source of the ID system and API if desired.

3. **Attribution**:
   - In your code or documentation, mention that the implementation adheres to the arXiv ID format and conventions.
   - Include a link to the [arXiv documentation on IDs](https://arxiv.org/help/arxiv_identifier) for reference.

4. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) if redistributing your code.
   - Clearly state that the implementation is based on publicly available standards.

By adhering to these principles, your implementation will respect technical and legal standards while providing robust functionality.

## 16. How do I write a validator, verifier and normalize functions for PubMed ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for PubMed ID in Deno and TypeScript

#### Understanding PubMed ID

The **PubMed ID (PMID)** is a unique integer identifier used by PubMed to reference biomedical and life sciences journal articles. Key characteristics of PMIDs:
- They are positive integers (e.g., `12345678`).
- There are no specific formatting rules apart from being a non-negative number.
- PMIDs are used to access articles via the PubMed system, e.g., `https://pubmed.ncbi.nlm.nih.gov/<PMID>`.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid PubMed ID (PMID).
 * @param pmid - The string to validate.
 * @returns boolean - `true` if the string is a valid PMID, otherwise `false`.
 */
export function validatePMID(pmid: string): boolean {
  const regex = /^[1-9]\d*$/; // Matches a positive integer
  return regex.test(pmid);
}

/**
 * Verifies if a PubMed ID exists by checking the PubMed API or website.
 * @param pmid - The PubMed ID to verify.
 * @returns Promise<boolean> - `true` if the PMID exists, otherwise `false`.
 */
export async function verifyPMID(pmid: string): Promise<boolean> {
  if (!validatePMID(pmid)) {
    return false;
  }

  try {
    const response = await fetch(`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a PubMed ID by trimming whitespace and ensuring it is a string.
 * @param pmid - The PubMed ID to normalize.
 * @returns string | null - The normalized PMID or `null` if the input is invalid.
 */
export function normalizePMID(pmid: string): string | null {
  if (!validatePMID(pmid)) {
    return null;
  }

  return pmid.trim();
}
```

---

### Usage Example

```typescript
import { validatePMID, verifyPMID, normalizePMID } from './pmidUtils.ts';

const input = ' 12345678 ';

// Validate PubMed ID
if (validatePMID(input)) {
  console.log('Valid PubMed ID format.');

  // Verify PubMed ID existence
  verifyPMID(input).then((exists) => {
    if (exists) {
      console.log('PubMed ID exists:', normalizePMID(input));
    } else {
      console.log('PubMed ID does not exist.');
    }
  });
} else {
  console.log('Invalid PubMed ID format.');
}
```

---

### Explanation

1. **Validator**:
   - Ensures the ID is a positive integer using a regular expression.
   - Excludes non-numeric characters or zero-prefixed numbers.

2. **Verifier**:
   - Sends a `HEAD` request to the PubMed website (`https://pubmed.ncbi.nlm.nih.gov/<PMID>`).
   - If the response status is `200`, the PMID exists.

3. **Normalizer**:
   - Trims any whitespace around the PMID.
   - Ensures the value is a valid string representation of the ID.

---

### Copyright and Attribution Requirements

1. **PubMed ID Standards**:
   - The concept and format of PMIDs are publicly documented by the [National Library of Medicine (NLM)](https://www.nlm.nih.gov/bsd/licensee.html). There are no restrictions on using the format for validation or utility functions.

2. **Using the PubMed Website/API**:
   - Accessing the PubMed website for verification purposes complies with their [Terms and Conditions](https://www.ncbi.nlm.nih.gov/home/about/policies/). Use of automated tools (like API requests) may have additional restrictions, so refer to their terms if needed.

3. **Attribution**:
   - In your code or documentation, acknowledge that the implementation follows the PubMed ID standard.
   - Include a link to PubMed ([https://pubmed.ncbi.nlm.nih.gov](https://pubmed.ncbi.nlm.nih.gov)) for reference.

4. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) if redistributing your code.
   - Note that the implementation is based on publicly available information.

This ensures your implementation adheres to PubMed ID standards and is legally compliant while providing robust functionality.

## 17. How do I write a validator, verifier and normalize functions for PubMed Central ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for PubMed Central ID in Deno and TypeScript

#### Understanding PubMed Central ID (PMCID)

The **PubMed Central ID (PMCID)** is a unique identifier used to reference articles archived in PubMed Central (PMC). The PMCID has the following format:

```
PMC########
```

Where:
- It always begins with `PMC`.
- The numeric part consists of 1 to 9 digits (e.g., `PMC123456`).

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid PubMed Central ID (PMCID).
 * @param pmcid - The string to validate.
 * @returns boolean - `true` if the string is a valid PMCID, otherwise `false`.
 */
export function validatePMCID(pmcid: string): boolean {
  const regex = /^PMC\d{1,9}$/; // Matches "PMC" followed by 1-9 digits
  return regex.test(pmcid);
}

/**
 * Verifies if a PubMed Central ID exists by checking the PubMed Central API or website.
 * @param pmcid - The PMCID to verify.
 * @returns Promise<boolean> - `true` if the PMCID exists, otherwise `false`.
 */
export async function verifyPMCID(pmcid: string): Promise<boolean> {
  if (!validatePMCID(pmcid)) {
    return false;
  }

  try {
    const response = await fetch(`https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a PubMed Central ID by trimming whitespace and ensuring consistent capitalization.
 * @param pmcid - The PMCID to normalize.
 * @returns string | null - The normalized PMCID or `null` if the input is invalid.
 */
export function normalizePMCID(pmcid: string): string | null {
  if (!validatePMCID(pmcid)) {
    return null;
  }

  return pmcid.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validatePMCID, verifyPMCID, normalizePMCID } from './pmcidUtils.ts';

const input = ' pmc123456 ';

// Validate PMCID
if (validatePMCID(input)) {
  console.log('Valid PMCID format.');

  // Verify PMCID existence
  verifyPMCID(input).then((exists) => {
    if (exists) {
      console.log('PMCID exists:', normalizePMCID(input));
    } else {
      console.log('PMCID does not exist.');
    }
  });
} else {
  console.log('Invalid PMCID format.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regular expression to ensure the PMCID starts with `PMC` and is followed by 1 to 9 digits.
   - Rejects invalid formats such as those with incorrect prefixes or non-numeric characters.

2. **Verifier**:
   - Sends a `HEAD` request to the PubMed Central article page URL (`https://www.ncbi.nlm.nih.gov/pmc/articles/<PMCID>/`).
   - If the response status is `200`, the PMCID exists.

3. **Normalizer**:
   - Trims leading and trailing whitespace.
   - Converts the PMCID to uppercase to ensure consistency (PubMed IDs are case-insensitive).

---

### Copyright and Attribution Requirements

1. **PubMed Central ID Standards**:
   - The format of PMCIDs is publicly documented and widely used. There are no copyright restrictions on implementing functions to handle this format.

2. **Using the PubMed Central Website/API**:
   - Accessing PubMed Central for verification purposes is allowed under their [Terms and Conditions](https://www.ncbi.nlm.nih.gov/home/about/policies/). Ensure compliance with any restrictions on automated requests if using the website for frequent lookups.

3. **Attribution**:
   - In your code or documentation, mention that the implementation follows the PMCID format as documented by PubMed Central.
   - Include a link to the [PubMed Central website](https://www.ncbi.nlm.nih.gov/pmc/) for user reference.

4. **Open Source Licensing**:
   - Use a permissive open-source license (e.g., MIT, Apache 2.0) if redistributing your code.
   - Note that the implementation is based on publicly available standards.

By following these guidelines, you ensure your code complies with legal and technical standards while providing robust functionality.

## 18. How do I write a validator, verifier and normalize functions for GND Identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for GND Identifier in Deno and TypeScript

#### Understanding GND Identifiers

The **GND Identifier (Gemeinsame Normdatei)** is a unique identifier used in the Integrated Authority File maintained by the German National Library. GND IDs are used to uniquely identify entities such as authors, organizations, and subjects.

#### GND Identifier Characteristics

- Format: A 9-digit number followed by a check digit (10 digits total).
- The check digit is computed using a **modulo-11 algorithm**.
- The identifier can optionally include the `gnd:` prefix (e.g., `gnd:123456789X`).

For details, refer to the [GND documentation](https://www.dnb.de/EN).

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Computes the check digit for a GND identifier.
 * @param base - The base of the GND ID (first 9 digits).
 * @returns string - The computed check digit.
 */
function computeCheckDigit(base: string): string {
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sum = base.split('')
    .map((digit, index) => parseInt(digit, 10) * weights[index])
    .reduce((a, b) => a + b, 0);
  const remainder = sum % 11;

  if (remainder === 10) return 'X';
  return remainder.toString();
}

/**
 * Validates if a string is a valid GND identifier.
 * @param gnd - The string to validate.
 * @returns boolean - `true` if the string is a valid GND identifier, otherwise `false`.
 */
export function validateGND(gnd: string): boolean {
  const regex = /^(gnd:)?\d{9}[0-9X]$/; // Matches the GND format with optional "gnd:" prefix
  if (!regex.test(gnd)) return false;

  // Remove the optional prefix for validation
  const id = gnd.replace(/^gnd:/, '');

  // Validate the check digit
  const base = id.slice(0, 9); // First 9 digits
  const checkDigit = id.slice(-1); // Last character
  return computeCheckDigit(base) === checkDigit;
}

/**
 * Verifies if a GND identifier exists by checking the German National Library's API.
 * @param gnd - The GND ID to verify.
 * @returns Promise<boolean> - `true` if the GND ID exists, otherwise `false`.
 */
export async function verifyGND(gnd: string): Promise<boolean> {
  if (!validateGND(gnd)) {
    return false;
  }

  const id = gnd.replace(/^gnd:/, ''); // Remove optional prefix
  try {
    const response = await fetch(`https://d-nb.info/gnd/${id}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a GND identifier by removing whitespace and ensuring the "gnd:" prefix.
 * @param gnd - The GND ID to normalize.
 * @returns string | null - The normalized GND ID or `null` if the input is invalid.
 */
export function normalizeGND(gnd: string): string | null {
  if (!validateGND(gnd)) {
    return null;
  }

  const id = gnd.replace(/^gnd:/, '').trim(); // Remove prefix and whitespace
  return `gnd:${id}`;
}
```

---

### Usage Example

```typescript
import { validateGND, verifyGND, normalizeGND } from './gndUtils.ts';

const input = ' gnd:123456789X ';

// Validate GND identifier
if (validateGND(input)) {
  console.log('Valid GND identifier.');

  // Verify GND identifier existence
  verifyGND(input).then((exists) => {
    if (exists) {
      console.log('GND identifier exists:', normalizeGND(input));
    } else {
      console.log('GND identifier does not exist.');
    }
  });
} else {
  console.log('Invalid GND identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Ensures the identifier matches the GND format using a regex.
   - Validates the check digit using the **modulo-11 algorithm**.

2. **Verifier**:
   - Sends a `HEAD` request to the German National Library's GND service (`https://d-nb.info/gnd/<ID>`).
   - A `200 OK` response indicates the ID exists.

3. **Normalizer**:
   - Ensures a consistent format by removing whitespace and enforcing the `gnd:` prefix.

---

### Copyright and Attribution Requirements

1. **GND Identifier Standards**:
   - The GND format and check digit algorithm are publicly documented. There are no copyright restrictions for implementing functions based on these standards.

2. **Using the GND Service**:
   - Accessing the GND service for verification is compliant with their terms. For heavy usage, consider contacting the German National Library to confirm any rate limits.

3. **Attribution**:
   - Mention in your documentation that the implementation is based on the GND standards.
   - Include a link to the [GND documentation](https://www.dnb.de/EN) for user reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) if redistributing the code.
   - Indicate that the implementation is based on publicly available standards.

This approach ensures robust validation, verification, and normalization of GND identifiers while adhering to legal and technical requirements.

## 19. How do I write a validator, verifier and normalize functions for SRA accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for SRA Accession Identifier in Deno and TypeScript

#### Understanding SRA Accession Identifiers

The **SRA Accession Identifier** is used by the Sequence Read Archive (SRA) at the National Center for Biotechnology Information (NCBI) to identify datasets and related entities in genomics. These identifiers follow specific patterns, depending on the type of entity:

1. **Prefixes**:
   - `SRR` - Sequence Read Records
   - `SRP` - Sequence Read Projects
   - `SRS` - Sequence Read Samples
   - `SRX` - Sequence Read Experiments

2. **Format**:
   - A prefix (`SRR`, `SRP`, `SRS`, `SRX`) followed by 6 to 9 digits, e.g., `SRR123456`, `SRP987654321`.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid SRA accession identifier.
 * @param sraId - The string to validate.
 * @returns boolean - `true` if the string is a valid SRA ID, otherwise `false`.
 */
export function validateSRA(sraId: string): boolean {
  const regex = /^(SRR|SRP|SRS|SRX)\d{6,9}$/; // Matches valid SRA accession formats
  return regex.test(sraId);
}

/**
 * Verifies if an SRA accession identifier exists by querying the NCBI SRA database.
 * @param sraId - The SRA ID to verify.
 * @returns Promise<boolean> - `true` if the SRA ID exists, otherwise `false`.
 */
export async function verifySRA(sraId: string): Promise<boolean> {
  if (!validateSRA(sraId)) {
    return false;
  }

  try {
    const response = await fetch(`https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${sraId}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes an SRA accession identifier by trimming whitespace and ensuring uppercase.
 * @param sraId - The SRA ID to normalize.
 * @returns string | null - The normalized SRA ID or `null` if the input is invalid.
 */
export function normalizeSRA(sraId: string): string | null {
  if (!validateSRA(sraId)) {
    return null;
  }

  return sraId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateSRA, verifySRA, normalizeSRA } from './sraUtils.ts';

const input = ' srr123456 ';

// Validate SRA accession identifier
if (validateSRA(input)) {
  console.log('Valid SRA identifier.');

  // Verify SRA identifier existence
  verifySRA(input).then((exists) => {
    if (exists) {
      console.log('SRA identifier exists:', normalizeSRA(input));
    } else {
      console.log('SRA identifier does not exist.');
    }
  });
} else {
  console.log('Invalid SRA identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to ensure the input matches the expected SRA format.
   - Checks the prefix (`SRR`, `SRP`, `SRS`, or `SRX`) and the length of the numeric part (6–9 digits).

2. **Verifier**:
   - Queries the NCBI SRA database using a `HEAD` request to check if the SRA ID exists.
   - A `200 OK` response indicates the ID is valid.

3. **Normalizer**:
   - Trims unnecessary whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **SRA Identifier Standards**:
   - The SRA identifier format is publicly documented by NCBI. There are no restrictions on implementing validation and utility functions for these identifiers.

2. **Using the NCBI Website**:
   - Accessing the NCBI website for verification is allowed under their [Terms and Conditions](https://www.ncbi.nlm.nih.gov/home/about/policies/). For frequent or automated lookups, consider checking their API or terms for additional guidelines.

3. **Attribution**:
   - Acknowledge that the implementation follows the SRA identifier format provided by NCBI.
   - Include a link to the [NCBI SRA page](https://www.ncbi.nlm.nih.gov/sra) for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) for your code if it will be redistributed.
   - Mention that the code is based on publicly available information about SRA accession identifiers.

This approach ensures compliance with NCBI guidelines while providing robust functionality for working with SRA accession identifiers.

## 20. How do I write a validator, verifier and normalize functions for BioProject accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for BioProject Accession Identifier in Deno and TypeScript

#### Understanding BioProject Accession Identifiers

The **BioProject Accession Identifier** is used by NCBI's BioProject database to identify research projects related to genomics and other biological data. These identifiers follow a specific format:

1. **Prefixes**:
   - `PRJNA` (projects submitted from North America)
   - `PRJEB` (projects submitted to the European Nucleotide Archive)
   - `PRJDB` (projects submitted to the DNA Data Bank of Japan)

2. **Format**:
   - A prefix (`PRJNA`, `PRJEB`, or `PRJDB`) followed by 1 to 6 digits, e.g., `PRJNA123456`.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid BioProject accession identifier.
 * @param bioprojectId - The string to validate.
 * @returns boolean - `true` if the string is a valid BioProject ID, otherwise `false`.
 */
export function validateBioProject(bioprojectId: string): boolean {
  const regex = /^(PRJNA|PRJEB|PRJDB)\d{1,6}$/; // Matches valid BioProject accession formats
  return regex.test(bioprojectId);
}

/**
 * Verifies if a BioProject accession identifier exists by querying the NCBI BioProject database.
 * @param bioprojectId - The BioProject ID to verify.
 * @returns Promise<boolean> - `true` if the BioProject ID exists, otherwise `false`.
 */
export async function verifyBioProject(bioprojectId: string): Promise<boolean> {
  if (!validateBioProject(bioprojectId)) {
    return false;
  }

  try {
    const response = await fetch(`https://www.ncbi.nlm.nih.gov/bioproject/${bioprojectId}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a BioProject accession identifier by trimming whitespace and ensuring uppercase.
 * @param bioprojectId - The BioProject ID to normalize.
 * @returns string | null - The normalized BioProject ID or `null` if the input is invalid.
 */
export function normalizeBioProject(bioprojectId: string): string | null {
  if (!validateBioProject(bioprojectId)) {
    return null;
  }

  return bioprojectId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateBioProject, verifyBioProject, normalizeBioProject } from './bioprojectUtils.ts';

const input = ' prjna123456 ';

// Validate BioProject accession identifier
if (validateBioProject(input)) {
  console.log('Valid BioProject identifier.');

  // Verify BioProject identifier existence
  verifyBioProject(input).then((exists) => {
    if (exists) {
      console.log('BioProject identifier exists:', normalizeBioProject(input));
    } else {
      console.log('BioProject identifier does not exist.');
    }
  });
} else {
  console.log('Invalid BioProject identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to ensure the input matches the expected BioProject format.
   - Checks the prefix (`PRJNA`, `PRJEB`, or `PRJDB`) and the length of the numeric part (1–6 digits).

2. **Verifier**:
   - Sends a `HEAD` request to the NCBI BioProject page (`https://www.ncbi.nlm.nih.gov/bioproject/<ID>`).
   - A `200 OK` response indicates the ID exists.

3. **Normalizer**:
   - Trims unnecessary whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **BioProject Identifier Standards**:
   - The format of BioProject identifiers is publicly documented by NCBI. There are no restrictions on implementing functions to validate, verify, and normalize these identifiers.

2. **Using the NCBI Website**:
   - Accessing NCBI for verification purposes is allowed under their [Terms and Conditions](https://www.ncbi.nlm.nih.gov/home/about/policies/). For frequent or automated queries, ensure compliance with their rate limits.

3. **Attribution**:
   - Mention that the implementation is based on the BioProject accession identifier standards provided by NCBI.
   - Include a link to the [NCBI BioProject website](https://www.ncbi.nlm.nih.gov/bioproject/) for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) for your code if you distribute it.
   - Note in the documentation that the code is based on publicly available BioProject identifier information.

This implementation ensures reliable handling of BioProject accession identifiers while adhering to best practices and NCBI guidelines.

## 21. How do I write a validator, verifier and normalize functions for BioSample accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for BioSample Accession Identifier in Deno and TypeScript

#### Understanding BioSample Accession Identifiers

The **BioSample Accession Identifier** is used by NCBI to identify metadata about biological samples. These identifiers have a specific format:

1. **Prefixes**:
   - `SAMN` (North America)
   - `SAME` (European Nucleotide Archive)
   - `SAMD` (DNA Data Bank of Japan)

2. **Format**:
   - A prefix (`SAMN`, `SAME`, or `SAMD`) followed by 6 to 9 digits, e.g., `SAMN12345678`.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid BioSample accession identifier.
 * @param biosampleId - The string to validate.
 * @returns boolean - `true` if the string is a valid BioSample ID, otherwise `false`.
 */
export function validateBioSample(biosampleId: string): boolean {
  const regex = /^(SAMN|SAME|SAMD)\d{6,9}$/; // Matches valid BioSample accession formats
  return regex.test(biosampleId);
}

/**
 * Verifies if a BioSample accession identifier exists by querying the NCBI BioSample database.
 * @param biosampleId - The BioSample ID to verify.
 * @returns Promise<boolean> - `true` if the BioSample ID exists, otherwise `false`.
 */
export async function verifyBioSample(biosampleId: string): Promise<boolean> {
  if (!validateBioSample(biosampleId)) {
    return false;
  }

  try {
    const response = await fetch(`https://www.ncbi.nlm.nih.gov/biosample/${biosampleId}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a BioSample accession identifier by trimming whitespace and ensuring uppercase.
 * @param biosampleId - The BioSample ID to normalize.
 * @returns string | null - The normalized BioSample ID or `null` if the input is invalid.
 */
export function normalizeBioSample(biosampleId: string): string | null {
  if (!validateBioSample(biosampleId)) {
    return null;
  }

  return biosampleId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateBioSample, verifyBioSample, normalizeBioSample } from './biosampleUtils.ts';

const input = ' samn12345678 ';

// Validate BioSample accession identifier
if (validateBioSample(input)) {
  console.log('Valid BioSample identifier.');

  // Verify BioSample identifier existence
  verifyBioSample(input).then((exists) => {
    if (exists) {
      console.log('BioSample identifier exists:', normalizeBioSample(input));
    } else {
      console.log('BioSample identifier does not exist.');
    }
  });
} else {
  console.log('Invalid BioSample identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to ensure the input matches the expected BioSample format.
   - Checks for a valid prefix (`SAMN`, `SAME`, or `SAMD`) and a numeric part of 6–9 digits.

2. **Verifier**:
   - Sends a `HEAD` request to the NCBI BioSample database URL (`https://www.ncbi.nlm.nih.gov/biosample/<ID>`).
   - A `200 OK` response indicates the identifier exists.

3. **Normalizer**:
   - Trims unnecessary whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **BioSample Identifier Standards**:
   - The BioSample identifier format is publicly documented by NCBI, and there are no restrictions on implementing these functions.

2. **Using the NCBI Website**:
   - Querying NCBI for verification is compliant with their [Terms and Conditions](https://www.ncbi.nlm.nih.gov/home/about/policies/). For frequent or automated queries, ensure you adhere to any rate limits.

3. **Attribution**:
   - Mention in your documentation that the implementation is based on BioSample identifier standards provided by NCBI.
   - Include a link to the [NCBI BioSample webpage](https://www.ncbi.nlm.nih.gov/biosample) for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) if redistributing the code.
   - Indicate that the code is based on publicly available information about BioSample accession identifiers.

By following this approach, you can handle BioSample identifiers effectively while adhering to best practices and respecting NCBI's guidelines.

## 22. How do I write a validator, verifier and normalize functions for Ensembl accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for Ensembl Accession Identifiers in Deno and TypeScript

#### Understanding Ensembl Accession Identifiers

Ensembl identifiers are used to reference various biological entities such as genes, transcripts, proteins, and regulatory features in the Ensembl database. These identifiers have specific formats depending on the type of entity:

1. **Common Prefixes**:
   - Gene IDs: `ENSG` (e.g., `ENSG00000139618`)
   - Transcript IDs: `ENST` (e.g., `ENST00000380152`)
   - Protein IDs: `ENSP` (e.g., `ENSP00000369497`)
   - Regulatory IDs: `ENSR` (e.g., `ENSR00000000010`)

2. **Format**:
   - Prefix followed by 11 numeric characters, e.g., `ENSG00000139618`.

3. **Version Numbers** (optional):
   - Identifiers can include a version suffix separated by a dot, e.g., `ENSG00000139618.2`.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid Ensembl accession identifier.
 * @param ensemblId - The string to validate.
 * @returns boolean - `true` if the string is a valid Ensembl ID, otherwise `false`.
 */
export function validateEnsembl(ensemblId: string): boolean {
  const regex = /^(ENS[GTPR]\d{11})(\.\d+)?$/; // Matches valid Ensembl IDs with optional version
  return regex.test(ensemblId);
}

/**
 * Verifies if an Ensembl accession identifier exists by querying the Ensembl REST API.
 * @param ensemblId - The Ensembl ID to verify.
 * @returns Promise<boolean> - `true` if the Ensembl ID exists, otherwise `false`.
 */
export async function verifyEnsembl(ensemblId: string): Promise<boolean> {
  if (!validateEnsembl(ensemblId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://rest.ensembl.org/lookup/id/${ensemblId}?content-type=application/json`,
      {
        method: 'GET',
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes an Ensembl accession identifier by trimming whitespace and converting to uppercase.
 * @param ensemblId - The Ensembl ID to normalize.
 * @returns string | null - The normalized Ensembl ID or `null` if the input is invalid.
 */
export function normalizeEnsembl(ensemblId: string): string | null {
  if (!validateEnsembl(ensemblId)) {
    return null;
  }

  return ensemblId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateEnsembl, verifyEnsembl, normalizeEnsembl } from './ensemblUtils.ts';

const input = '  ensG00000139618.2 ';

// Validate Ensembl accession identifier
if (validateEnsembl(input)) {
  console.log('Valid Ensembl identifier.');

  // Verify Ensembl identifier existence
  verifyEnsembl(input).then((exists) => {
    if (exists) {
      console.log('Ensembl identifier exists:', normalizeEnsembl(input));
    } else {
      console.log('Ensembl identifier does not exist.');
    }
  });
} else {
  console.log('Invalid Ensembl identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to check the prefix (`ENSG`, `ENST`, `ENSP`, or `ENSR`), followed by 11 numeric digits.
   - Optionally validates a version suffix (e.g., `.2`).

2. **Verifier**:
   - Sends a GET request to the [Ensembl REST API](https://rest.ensembl.org/) to check if the identifier exists.
   - The endpoint `https://rest.ensembl.org/lookup/id/<ID>` returns details if the ID is valid.

3. **Normalizer**:
   - Trims extra whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **Ensembl Identifier Standards**:
   - Ensembl provides documentation on identifier formats. These formats are publicly available, and there are no restrictions on implementing validation or utility functions.

2. **Using the Ensembl REST API**:
   - The Ensembl REST API is publicly accessible and can be used for non-commercial and fair-use purposes. For automated or frequent requests, ensure compliance with their rate limits and API guidelines detailed in the [Ensembl documentation](https://rest.ensembl.org/documentation/info).

3. **Attribution**:
   - Include a mention in your documentation that the validation and verification are based on Ensembl identifier formats and use the Ensembl REST API.
   - Provide a link to the [Ensembl project](https://ensembl.org/) for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) if redistributing the code.
   - State in the documentation that the code was developed based on publicly available Ensembl identifier specifications.

This implementation ensures robust handling of Ensembl accession identifiers while respecting attribution requirements and usage policies.

## 23. How do I write a validator, verifier and normalize functions for UniProt accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for UniProt Accession Identifiers in Deno and TypeScript

#### Understanding UniProt Accession Identifiers

**UniProt Accession Identifiers** are used to reference entries in the UniProt database, a resource for protein sequence and functional information. These identifiers have specific formats:

1. **Primary Format**:
   - Consists of 6 or 10 alphanumeric characters.
   - 6-character examples: `P12345`, `Q8NBP7`.
   - 10-character examples (introduced in 2021): `A0A0B4J2D5`.

2. **Validation Rules**:
   - Starts with an uppercase letter (`[A-N]`, `[P-Z]`).
   - Followed by a mix of uppercase letters and digits.
   - 6 or 10 total characters.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid UniProt accession identifier.
 * @param uniprotId - The string to validate.
 * @returns boolean - `true` if the string is a valid UniProt ID, otherwise `false`.
 */
export function validateUniProt(uniprotId: string): boolean {
  const regex = /^[A-NP-Z][0-9][A-Z0-9]{3}[0-9]$|^[A-NP-Z][A-Z0-9]{9}$/;
  return regex.test(uniprotId);
}

/**
 * Verifies if a UniProt accession identifier exists by querying the UniProt API.
 * @param uniprotId - The UniProt ID to verify.
 * @returns Promise<boolean> - `true` if the UniProt ID exists, otherwise `false`.
 */
export async function verifyUniProt(uniprotId: string): Promise<boolean> {
  if (!validateUniProt(uniprotId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://rest.uniprot.org/uniprotkb/${uniprotId}?format=json`,
      {
        method: 'GET',
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Normalizes a UniProt accession identifier by trimming whitespace and converting to uppercase.
 * @param uniprotId - The UniProt ID to normalize.
 * @returns string | null - The normalized UniProt ID or `null` if the input is invalid.
 */
export function normalizeUniProt(uniprotId: string): string | null {
  if (!validateUniProt(uniprotId)) {
    return null;
  }

  return uniprotId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateUniProt, verifyUniProt, normalizeUniProt } from './uniprotUtils.ts';

const input = ' p12345 ';

// Validate UniProt accession identifier
if (validateUniProt(input)) {
  console.log('Valid UniProt identifier.');

  // Verify UniProt identifier existence
  verifyUniProt(input).then((exists) => {
    if (exists) {
      console.log('UniProt identifier exists:', normalizeUniProt(input));
    } else {
      console.log('UniProt identifier does not exist.');
    }
  });
} else {
  console.log('Invalid UniProt identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to match 6 or 10 alphanumeric characters with the correct structure:
     - 6-character IDs: `[A-NP-Z][0-9][A-Z0-9]{3}[0-9]`.
     - 10-character IDs: `[A-NP-Z][A-Z0-9]{9}`.

2. **Verifier**:
   - Queries the UniProt REST API (`https://rest.uniprot.org/uniprotkb/<ID>`).
   - A successful `GET` request indicates the ID exists.

3. **Normalizer**:
   - Trims excess whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **UniProt Identifier Standards**:
   - The format of UniProt accession identifiers is publicly documented and can be freely implemented.

2. **Using the UniProt API**:
   - The UniProt API is openly accessible for non-commercial and research purposes. Ensure compliance with their [Terms of Use](https://www.uniprot.org/help/legal).

3. **Attribution**:
   - Mention in your documentation that the validation and verification functions are based on the UniProt accession identifier format and make use of the UniProt REST API.
   - Provide a link to the [UniProt](https://www.uniprot.org/) website for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) if you plan to share or distribute the code.
   - Document that the implementation is based on publicly available specifications for UniProt identifiers.

This implementation is robust, adheres to best practices, and respects attribution and copyright requirements for UniProt data.

## 24. How do I write a validator, verifier and normalize functions for RefSeq accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for RefSeq Accession Identifiers in Deno and TypeScript

#### Understanding RefSeq Accession Identifiers

RefSeq Accession Identifiers are used by NCBI to refer to sequences in the **RefSeq database**. These identifiers have specific formats based on the type of sequence:

1. **Prefixes**:
   - `NM_`, `NR_`, `XM_`, `XR_`: mRNA and non-coding RNA.
   - `NP_`, `XP_`: Proteins.
   - `NC_`, `AC_`, `NG_`, `NT_`, `NW_`: Genomic sequences.
   - `NZ_`, `WP_`: Complete genomes and proteins in certain categories.

2. **Format**:
   - Prefix followed by 6, 8, or more digits (e.g., `NM_000207`, `XP_015642853`).
   - May include a version number suffix (e.g., `NM_000207.2`).

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid RefSeq accession identifier.
 * @param refSeqId - The string to validate.
 * @returns boolean - `true` if the string is a valid RefSeq ID, otherwise `false`.
 */
export function validateRefSeq(refSeqId: string): boolean {
  const regex = /^(?:NC|AC|NG|NT|NW|NZ|NM|NR|XM|XR|NP|XP|WP)_[0-9]{6,}(\.\d+)?$/;
  return regex.test(refSeqId);
}

/**
 * Verifies if a RefSeq accession identifier exists by querying the NCBI E-Utilities API.
 * @param refSeqId - The RefSeq ID to verify.
 * @returns Promise<boolean> - `true` if the RefSeq ID exists, otherwise `false`.
 */
export async function verifyRefSeq(refSeqId: string): Promise<boolean> {
  if (!validateRefSeq(refSeqId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&term=${refSeqId}[accn]&retmode=json`,
      {
        method: 'GET',
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.esearchresult.idlist.length > 0;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Normalizes a RefSeq accession identifier by trimming whitespace and converting to uppercase.
 * @param refSeqId - The RefSeq ID to normalize.
 * @returns string | null - The normalized RefSeq ID or `null` if the input is invalid.
 */
export function normalizeRefSeq(refSeqId: string): string | null {
  if (!validateRefSeq(refSeqId)) {
    return null;
  }

  return refSeqId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateRefSeq, verifyRefSeq, normalizeRefSeq } from './refseqUtils.ts';

const input = '  nm_000207.2 ';

// Validate RefSeq accession identifier
if (validateRefSeq(input)) {
  console.log('Valid RefSeq identifier.');

  // Verify RefSeq identifier existence
  verifyRefSeq(input).then((exists) => {
    if (exists) {
      console.log('RefSeq identifier exists:', normalizeRefSeq(input));
    } else {
      console.log('RefSeq identifier does not exist.');
    }
  });
} else {
  console.log('Invalid RefSeq identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to match valid RefSeq identifiers.
   - Supports optional version numbers, e.g., `.2`.

2. **Verifier**:
   - Queries the [NCBI E-Utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25499/) to check if the identifier exists.
   - Looks for results in the `idlist` field of the API response.

3. **Normalizer**:
   - Trims whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **RefSeq Identifier Standards**:
   - RefSeq identifier formats are publicly documented, and there are no restrictions on implementing these functions.

2. **Using the NCBI E-Utilities API**:
   - The API is free for research and educational use. Automated queries should adhere to NCBI's usage guidelines:
     - Provide a user agent string (optional for low traffic).
     - Avoid sending too many requests in a short time to prevent rate-limiting or blocking.
     - Follow [NCBI's E-Utilities usage policies](https://www.ncbi.nlm.nih.gov/books/NBK25497/).

3. **Attribution**:
   - Mention that the implementation is based on RefSeq identifier formats and uses NCBI’s E-Utilities API.
   - Include a reference to [NCBI RefSeq](https://www.ncbi.nlm.nih.gov/refseq/) in your documentation.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) for redistributing the code.
   - State that the implementation relies on publicly available RefSeq specifications and NCBI services.

By adhering to these guidelines, you can effectively handle RefSeq identifiers while respecting copyright and attribution requirements.

## 25. How do I write a validator, verifier and normalize functions for GenBank or RefSeq genome assembly accession identifier in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalizer for GenBank or RefSeq Genome Assembly Accession Identifiers in Deno and TypeScript

#### Understanding Genome Assembly Accession Identifiers

GenBank and RefSeq genome assembly accession identifiers are used to reference genomic sequences in the **NCBI GenBank** and **RefSeq** databases. These identifiers follow specific formats:

1. **Prefixes**:
   - `GCA_`: GenBank Assembly.
   - `GCF_`: RefSeq Assembly.

2. **Format**:
   - Prefix followed by 9 numeric digits (e.g., `GCA_000001405`) and may include a version suffix (e.g., `.1`).

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
/**
 * Validates if a string is a valid GenBank or RefSeq genome assembly accession identifier.
 * @param assemblyId - The string to validate.
 * @returns boolean - `true` if the string is a valid genome assembly ID, otherwise `false`.
 */
export function validateGenomeAssembly(assemblyId: string): boolean {
  const regex = /^(GCA|GCF)_[0-9]{9}(\.\d+)?$/;
  return regex.test(assemblyId);
}

/**
 * Verifies if a genome assembly accession identifier exists by querying the NCBI E-Utilities API.
 * @param assemblyId - The genome assembly ID to verify.
 * @returns Promise<boolean> - `true` if the genome assembly ID exists, otherwise `false`.
 */
export async function verifyGenomeAssembly(assemblyId: string): Promise<boolean> {
  if (!validateGenomeAssembly(assemblyId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&term=${assemblyId}[assembly_accession]&retmode=json`,
      {
        method: 'GET',
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.esearchresult.idlist.length > 0;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Normalizes a genome assembly accession identifier by trimming whitespace and converting to uppercase.
 * @param assemblyId - The genome assembly ID to normalize.
 * @returns string | null - The normalized genome assembly ID or `null` if the input is invalid.
 */
export function normalizeGenomeAssembly(assemblyId: string): string | null {
  if (!validateGenomeAssembly(assemblyId)) {
    return null;
  }

  return assemblyId.trim().toUpperCase();
}
```

---

### Usage Example

```typescript
import { validateGenomeAssembly, verifyGenomeAssembly, normalizeGenomeAssembly } from './genomeAssemblyUtils.ts';

const input = '  gca_000001405.28 ';

// Validate genome assembly accession identifier
if (validateGenomeAssembly(input)) {
  console.log('Valid genome assembly identifier.');

  // Verify genome assembly identifier existence
  verifyGenomeAssembly(input).then((exists) => {
    if (exists) {
      console.log('Genome assembly identifier exists:', normalizeGenomeAssembly(input));
    } else {
      console.log('Genome assembly identifier does not exist.');
    }
  });
} else {
  console.log('Invalid genome assembly identifier.');
}
```

---

### Explanation

1. **Validator**:
   - Uses a regex to validate the format of the genome assembly accession identifier:
     - Must start with `GCA_` or `GCF_`.
     - Followed by exactly 9 numeric digits.
     - Optionally includes a version suffix (e.g., `.28`).

2. **Verifier**:
   - Queries the [NCBI E-Utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25499/) using the `assembly` database.
   - Looks for results in the `idlist` field of the API response.

3. **Normalizer**:
   - Trims extra whitespace and converts the identifier to uppercase for consistency.

---

### Copyright and Attribution Requirements

1. **Genome Assembly Identifier Standards**:
   - The format of genome assembly accession identifiers is publicly documented and freely available for implementation.

2. **Using the NCBI E-Utilities API**:
   - NCBI’s E-Utilities API is free for research and educational use.
   - Follow NCBI’s [usage policies](https://www.ncbi.nlm.nih.gov/books/NBK25497/):
     - Do not exceed the API rate limits.
     - Provide a user agent string for automated queries if making frequent requests.

3. **Attribution**:
   - Mention in your documentation that the validation and verification functions are based on the genome assembly accession identifier format and use the NCBI E-Utilities API.
   - Provide a link to [NCBI Assembly Database](https://www.ncbi.nlm.nih.gov/assembly/) for reference.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) if redistributing the code.
   - Include a note in your documentation that the implementation relies on publicly available standards for GenBank and RefSeq genome assemblies.

This implementation ensures adherence to NCBI guidelines and robustly handles genome assembly identifiers while respecting copyright and attribution requirements.

## 26. How do I write a validator, verifier and normalize functions for detect identifier schemes in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Functions to Detect Identifier Schemes in Deno and TypeScript

To detect various identifier schemes (e.g., DOI, ORCID, ISBN, RefSeq, etc.), we can create functions to identify the type of a given string based on predefined patterns for each scheme. This involves:

1. **Validator**:
   - Checks the input against multiple identifier-specific regex patterns.
   - Determines which identifier scheme, if any, the input matches.

2. **Verifier**:
   - Optionally queries relevant APIs for each scheme to verify the existence of the identifier.

3. **Normalizer**:
   - Cleans and standardizes the identifier format for easier processing.

---

### Implementation in TypeScript (Deno Compatible)

#### Code

```typescript
type IdentifierScheme = 'DOI' | 'ORCID' | 'ISBN' | 'RefSeq' | 'UniProt' | 'Unknown';

/**
 * Detects the identifier scheme of a given input.
 * @param identifier - The identifier to check.
 * @returns IdentifierScheme - The detected scheme, or 'Unknown' if not matched.
 */
export function detectIdentifierScheme(identifier: string): IdentifierScheme {
  const patterns: Record<IdentifierScheme, RegExp> = {
    DOI: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
    ORCID: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
    ISBN: /^(97(8|9))?\d{9}[\dX]$/,
    RefSeq: /^(GCA|GCF|NC|NM|NR|XM|XR|NP|XP|WP)_[0-9]{6,}(\.\d+)?$/,
    UniProt: /^[A-NP-Z][0-9][A-Z0-9]{3}[0-9]$|^[A-NP-Z][A-Z0-9]{9}$/,
    Unknown: /.*/,
  };

  for (const [scheme, pattern] of Object.entries(patterns)) {
    if (pattern.test(identifier.trim())) {
      return scheme as IdentifierScheme;
    }
  }

  return 'Unknown';
}

/**
 * Verifies if an identifier exists by querying an appropriate API (if applicable).
 * @param identifier - The identifier to verify.
 * @param scheme - The detected scheme of the identifier.
 * @returns Promise<boolean> - `true` if the identifier exists, otherwise `false`.
 */
export async function verifyIdentifier(
  identifier: string,
  scheme: IdentifierScheme
): Promise<boolean> {
  const normalized = normalizeIdentifier(identifier, scheme);
  if (!normalized) return false;

  switch (scheme) {
    case 'DOI':
      return verifyDOI(normalized);
    case 'ORCID':
      return verifyORCID(normalized);
    case 'RefSeq':
      return verifyRefSeq(normalized);
    default:
      return true; // No verification available for other schemes
  }
}

/**
 * Normalizes the input based on the identifier scheme.
 * @param identifier - The identifier to normalize.
 * @param scheme - The detected scheme of the identifier.
 * @returns string | null - The normalized identifier or `null` if invalid.
 */
export function normalizeIdentifier(
  identifier: string,
  scheme: IdentifierScheme
): string | null {
  switch (scheme) {
    case 'DOI':
      return identifier.trim().toLowerCase();
    case 'ORCID':
      return identifier.trim();
    case 'ISBN':
      return identifier.replace(/[^0-9X]/gi, '').trim();
    case 'RefSeq':
    case 'UniProt':
      return identifier.trim().toUpperCase();
    default:
      return null;
  }
}

// Example of a DOI verifier using the CrossRef API
async function verifyDOI(doi: string): Promise<boolean> {
  try {
    const response = await fetch(`https://doi.org/api/handles/${encodeURIComponent(doi)}`);
    return response.ok;
  } catch {
    return false;
  }
}

// Example of an ORCID verifier using the ORCID API
async function verifyORCID(orcid: string): Promise<boolean> {
  const regex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
  if (!regex.test(orcid)) return false;

  try {
    const response = await fetch(`https://pub.orcid.org/v3.0/${orcid}`);
    return response.ok;
  } catch {
    return false;
  }
}

// Example of a RefSeq verifier using NCBI's API
async function verifyRefSeq(refSeq: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&term=${refSeq}[assembly_accession]&retmode=json`
    );
    const data = await response.json();
    return response.ok && data.esearchresult.idlist.length > 0;
  } catch {
    return false;
  }
}
```

---

### Usage Example

```typescript
import { detectIdentifierScheme, verifyIdentifier, normalizeIdentifier } from './identifierUtils.ts';

const input = ' GCA_000001405.28 ';

// Detect the identifier scheme
const scheme = detectIdentifierScheme(input);
console.log('Detected scheme:', scheme);

if (scheme !== 'Unknown') {
  // Normalize the identifier
  const normalized = normalizeIdentifier(input, scheme);
  console.log('Normalized identifier:', normalized);

  // Verify the identifier
  verifyIdentifier(input, scheme).then((exists) => {
    console.log(`Identifier exists: ${exists}`);
  });
} else {
  console.log('Unknown identifier scheme.');
}
```

---

### Copyright and Attribution Requirements

1. **Identifier Standards**:
   - The formats of identifiers (e.g., DOI, ORCID, RefSeq) are publicly documented and freely available for implementation.

2. **Using APIs**:
   - APIs like CrossRef (DOI), ORCID, and NCBI have usage policies. Ensure compliance with their terms of service:
     - Avoid excessive requests or rate-limit violations.
     - Provide proper attribution to these services in your documentation.

3. **Attribution**:
   - Mention that the implementation relies on identifier formats and APIs from relevant organizations (e.g., ORCID, NCBI, CrossRef).
   - Include links to their documentation.

4. **Open Source Licensing**:
   - Use a permissive license (e.g., MIT, Apache 2.0) for redistribution.
   - Document your reliance on publicly available identifier standards and APIs.

This implementation provides a framework to detect and handle multiple identifier schemes while respecting attribution and copyright requirements.

## 27. How do I write a validator, verifier and normalize functions for FundRef IDs in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalize Functions for **FunderRef IDs** in Deno and TypeScript

**FunderRef IDs** are unique identifiers used by CrossRef to refer to funding organizations. These IDs are part of the CrossRef Funder Registry and are used in metadata to link publications with funding data.

---

### Overview of FunderRef IDs

1. **Format**:
   - FunderRef IDs are numeric strings (e.g., `501100000024`).
   - No special checksum or validation algorithm applies; the IDs need to be looked up in the Funder Registry for verification.

2. **Validation**:
   - Ensure the ID is numeric.
   - Confirm that the length is within reasonable bounds (e.g., typically 12-14 digits).

3. **Normalization**:
   - Remove extraneous characters (spaces, non-numeric characters).
   - Ensure a consistent numeric string format.

4. **Verification**:
   - Query the CrossRef Funder Registry API to verify if the FunderRef ID exists and retrieve associated metadata.

---

### Implementation in TypeScript

#### 1. Validator

```typescript
/**
 * Validates a FunderRef ID for format correctness.
 * @param funderRefId - The FunderRef ID string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateFunderRefId(funderRefId: string): boolean {
  const normalizedId = normalizeFunderRefId(funderRefId);
  return /^\d+$/.test(normalizedId) && normalizedId.length >= 12 && normalizedId.length <= 14;
}
```

---

#### 2. Normalizer

```typescript
/**
 * Normalizes a FunderRef ID by removing non-numeric characters.
 * @param funderRefId - The FunderRef ID string to normalize.
 * @returns string - The normalized FunderRef ID.
 */
export function normalizeFunderRefId(funderRefId: string): string {
  return funderRefId.replace(/\D/g, '');
}
```

---

#### 3. Verifier

Use the **CrossRef Funder Registry API** to verify the existence of a FunderRef ID.

```typescript
/**
 * Verifies a FunderRef ID using the CrossRef Funder Registry API.
 * @param funderRefId - The FunderRef ID to verify.
 * @returns Promise<boolean> - True if the FunderRef ID exists, otherwise false.
 */
export async function verifyFunderRefId(funderRefId: string): Promise<boolean> {
  const normalizedId = normalizeFunderRefId(funderRefId);

  try {
    const response = await fetch(
      `https://api.crossref.org/funders/${encodeURIComponent(normalizedId)}`
    );

    if (!response.ok) return false;

    const data = await response.json();
    return !!data?.message?.id; // Check if an ID exists in the response
  } catch {
    return false;
  }
}
```

---

### Example Usage

```typescript
import {
  validateFunderRefId,
  normalizeFunderRefId,
  verifyFunderRefId,
} from './funderRefUtils.ts';

const funderId = "501100000024";

// Validate
const isValid = validateFunderRefId(funderId);
console.log(`Is valid FunderRef ID: ${isValid}`);

// Normalize
const normalizedId = normalizeFunderRefId(funderId);
console.log(`Normalized FunderRef ID: ${normalizedId}`);

// Verify
verifyFunderRefId(normalizedId).then((exists) => {
  console.log(`FunderRef ID exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **FunderRef ID Specification**
- FunderRef IDs themselves are identifiers in the public domain and require no copyright permissions for usage.

#### 2. **CrossRef Funder Registry API**
- **Attribution**: When querying the CrossRef API, follow their [terms of service](https://www.crossref.org/services/funder-registry/).
- Attribution is recommended if the API data is used in published works or services.
- Respect API rate limits and usage policies.

#### 3. **Redistributing Your Code**
- If you plan to distribute your code, use a permissive license like MIT or Apache 2.0.
- Attribute any external libraries or codebases used in your implementation.

---

This implementation ensures you can validate, normalize, and verify FunderRef IDs while respecting the CrossRef API's usage guidelines.


## 28. How do I write a validator, verifier, and normalize functions for CiteProc in Deno and TypeScript? How to I write a style render engine for CiteProc using CSL in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

To create a **validator, verifier, and normalizer** for **CiteProc** in Deno and TypeScript, as well as a **rendering engine for Citation Style Language (CSL)**, we need to follow these steps:

---

### Part 1: Validator, Verifier, and Normalizer for CiteProc

**CiteProc** is a citation processing library that relies on structured data (e.g., JSON or JSON-like objects) and styles written in CSL (XML-based styles).

#### 1. Validator

A validator checks that the input JSON data conforms to the CiteProc standard (e.g., required fields, valid types, etc.).

```typescript
export interface Citation {
  id: string;
  type: string; // e.g., "article-journal", "book", etc.
  title?: string;
  author?: Array<{ family: string; given?: string }>;
  issued?: { 'date-parts': number[][] }; // e.g., [[2023, 5, 10]]
  DOI?: string;
  [key: string]: unknown;
}

/**
 * Validates a CiteProc citation object.
 * @param citation - The citation object to validate.
 * @returns boolean - `true` if the citation is valid, otherwise `false`.
 */
export function validateCitation(citation: Citation): boolean {
  if (!citation.id || !citation.type) return false;
  if (citation.author) {
    for (const author of citation.author) {
      if (!author.family) return false;
    }
  }
  if (citation.issued && !Array.isArray(citation.issued['date-parts'])) {
    return false;
  }
  return true;
}
```

#### 2. Verifier

A verifier could validate external references like DOI. Use APIs (e.g., CrossRef) to check if the identifiers exist.

```typescript
export async function verifyDOI(doi: string): Promise<boolean> {
  try {
    const response = await fetch(`https://doi.org/api/handles/${encodeURIComponent(doi)}`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Verifies if a citation contains a valid DOI.
 * @param citation - The citation object.
 * @returns Promise<boolean> - `true` if the DOI is valid or absent, otherwise `false`.
 */
export async function verifyCitation(citation: Citation): Promise<boolean> {
  if (citation.DOI) {
    return await verifyDOI(citation.DOI);
  }
  return true;
}
```

#### 3. Normalizer

A normalizer ensures consistent formats (e.g., trims whitespace, sets defaults for missing fields).

```typescript
/**
 * Normalizes a CiteProc citation object.
 * @param citation - The citation object to normalize.
 * @returns Citation - The normalized citation object.
 */
export function normalizeCitation(citation: Citation): Citation {
  if (citation.title) {
    citation.title = citation.title.trim();
  }
  if (citation.author) {
    citation.author = citation.author.map((author) => ({
      family: author.family.trim(),
      given: author.given?.trim(),
    }));
  }
  return citation;
}
```

---

### Part 2: Render Engine for CiteProc Using CSL

#### 1. Loading CSL Styles

CSL styles are XML files. Use a library like `xmldom` or Deno’s built-in `DOMParser` to parse the styles.

```typescript
export async function loadCslStyle(url: string): Promise<Document> {
  const response = await fetch(url);
  const xml = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(xml, "application/xml");
}
```

#### 2. Rendering Engine

You can use CiteProc.js, an open-source library written in JavaScript, which can be integrated into Deno. CiteProc.js handles parsing CSL, applying it to data, and generating formatted citations.

##### Example Integration of CiteProc.js:

Install CiteProc.js using Deno's npm compatibility:

```bash
deno install npm:citeproc
```

Then write your render engine:

```typescript
import CiteProc from 'citeproc';

/**
 * Renders citations using a CSL style.
 * @param citations - The array of CiteProc citation objects.
 * @param style - The CSL style as a string.
 * @param lang - The language for the style (default: 'en-US').
 * @returns string[] - An array of formatted citations.
 */
export function renderCitations(
  citations: Citation[],
  style: string,
  lang = 'en-US'
): string[] {
  const sys = {
    retrieveLocale: (locale) => {
      // Load CSL locale (you'll need to fetch locale XMLs as well)
      return fetch(`https://example.com/csl-locales/${locale}.xml`).then((res) =>
        res.text()
      );
    },
    retrieveItem: (id) => citations.find((citation) => citation.id === id),
  };

  const citeproc = new CiteProc.Engine(sys, style, lang);

  const items = citations.map((citation) => citation.id);
  citeproc.updateItems(items);

  return items.map((id) => citeproc.makeBibliography()[1][id]);
}
```

#### 3. Example Usage

```typescript
import { renderCitations, loadCslStyle } from './cslRenderer.ts';

const citations = [
  {
    id: "1",
    type: "article-journal",
    title: "A study on something",
    author: [{ family: "Smith", given: "John" }],
    issued: { "date-parts": [[2023, 5, 10]] },
    DOI: "10.1234/example.doi",
  },
];

const cslUrl = "https://www.zotero.org/styles/apa";

const style = await loadCslStyle(cslUrl);
const formatted = renderCitations(citations, style);

console.log(formatted);
```

---

### Copyright and Attribution Requirements

1. **CiteProc.js**:
   - CiteProc.js is licensed under the [AGPL](https://github.com/Juris-M/citeproc-js/blob/master/LICENSE), which requires attribution and sharing derivative works under the same license.

2. **CSL Styles**:
   - CSL styles are distributed under the [CC BY-SA 3.0 license](https://creativecommons.org/licenses/by-sa/3.0/), requiring attribution and the sharing of modifications under the same terms.

3. **Usage Notes**:
   - Attribute the authors of the CSL styles you use.
   - When using or modifying CiteProc.js, adhere to the AGPL requirements by sharing your source code.

4. **Open Source Licensing**:
   - Use a compatible license (e.g., AGPL) for your project if integrating CiteProc.js.
   - Attribute CSL styles explicitly, linking to the style repository (e.g., [Zotero CSL repository](https://github.com/citation-style-language/styles)).

By following these steps, you can build a robust, standards-compliant citation processing and rendering engine while respecting licensing requirements.

## 29. How do I write a validator, verifier and normalize functions for LACNAF ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalize Functions for **LACNAF ID** in Deno and TypeScript

**LACNAF IDs** are identifiers used by the **Library of Congress Name Authority File (LCNAF)** to uniquely identify names in the authority database. These IDs are part of a broader system for cataloging and standardizing bibliographic and authority records.

---

### Overview of LACNAF ID

1. **Format**:
   - LACNAF IDs are typically alphanumeric strings (e.g., `n79021164`).
   - They may have a prefix indicating the type of record (`n`, `no`, `nb`, etc.).
   - The suffix is a numeric sequence that uniquely identifies the record.

2. **Validation**:
   - Ensure the ID matches the expected alphanumeric format.
   - Prefixes are usually constrained to specific letters (`n`, `nb`, `no`).

3. **Normalization**:
   - Remove extraneous characters.
   - Ensure consistent lowercase format.

4. **Verification**:
   - Query the **Library of Congress Authorities & Vocabularies API** to check the ID's existence.

---

### Implementation in TypeScript

#### 1. Validator

```typescript
/**
 * Validates a LACNAF ID for format correctness.
 * @param lacnafId - The LACNAF ID to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateLacnafId(lacnafId: string): boolean {
  const normalizedId = normalizeLacnafId(lacnafId);
  const lacnafRegex = /^(n|nb|no)\d+$/;
  return lacnafRegex.test(normalizedId);
}
```

---

#### 2. Normalizer

```typescript
/**
 * Normalizes a LACNAF ID by removing extraneous characters and enforcing lowercase.
 * @param lacnafId - The LACNAF ID to normalize.
 * @returns string - The normalized LACNAF ID.
 */
export function normalizeLacnafId(lacnafId: string): string {
  return lacnafId.trim().toLowerCase();
}
```

---

#### 3. Verifier

Use the **Library of Congress Authorities & Vocabularies API** to check if the LACNAF ID exists.

```typescript
/**
 * Verifies a LACNAF ID using the Library of Congress Authorities & Vocabularies API.
 * @param lacnafId - The LACNAF ID to verify.
 * @returns Promise<boolean> - True if the LACNAF ID exists, otherwise false.
 */
export async function verifyLacnafId(lacnafId: string): Promise<boolean> {
  const normalizedId = normalizeLacnafId(lacnafId);

  try {
    const response = await fetch(
      `https://id.loc.gov/authorities/names/${encodeURIComponent(normalizedId)}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
```

---

### Example Usage

```typescript
import {
  validateLacnafId,
  normalizeLacnafId,
  verifyLacnafId,
} from './lacnafUtils.ts';

const lacnafId = " n79021164 ";

// Validate
const isValid = validateLacnafId(lacnafId);
console.log(`Is valid LACNAF ID: ${isValid}`);

// Normalize
const normalizedId = normalizeLacnafId(lacnafId);
console.log(`Normalized LACNAF ID: ${normalizedId}`);

// Verify
verifyLacnafId(normalizedId).then((exists) => {
  console.log(`LACNAF ID exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **LACNAF Specification**
- LACNAF IDs are publicly accessible identifiers and do not require copyright permissions for validation or normalization.

#### 2. **Library of Congress API**
- The Library of Congress provides free API access to its authorities database.
- Review their [terms of use](https://www.loc.gov/legal/) to ensure compliance with usage policies.
- No explicit attribution is required, but acknowledging their services is good practice.

#### 3. **Redistributing Your Code**
- Use a permissive license such as MIT or Apache 2.0 if you plan to distribute your implementation.
- Attribute any external libraries or resources used in your implementation, if applicable.

---

This implementation ensures compliance with LACNAF ID standards while enabling robust validation, normalization, and verification through the Library of Congress' APIs.

## 30. How do I write a validator, verifier and normalize functions for VIAF ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalize Functions for **VIAF ID** in Deno and TypeScript

The **VIAF ID** (Virtual International Authority File Identifier) is a numeric identifier used to link and manage authority records across various national libraries and authority systems.

---

### Overview of VIAF ID

1. **Format**:
   - VIAF IDs are numeric, typically consisting of 1 to 10 digits (e.g., `123456789`).
   - They should not contain any non-numeric characters.

2. **Validation**:
   - Ensure the identifier consists only of digits.
   - Verify that the ID length falls within reasonable bounds (e.g., 1–10 digits).

3. **Normalization**:
   - Remove extraneous characters (e.g., spaces, non-numeric symbols).
   - Output a pure numeric string.

4. **Verification**:
   - Use the **VIAF API** to verify if the ID exists and retrieve related metadata.

---

### Implementation in TypeScript

#### 1. Validator

```typescript
/**
 * Validates a VIAF ID for format correctness.
 * @param viafId - The VIAF ID string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateViafId(viafId: string): boolean {
  const normalizedId = normalizeViafId(viafId);
  return /^\d{1,10}$/.test(normalizedId);
}
```

---

#### 2. Normalizer

```typescript
/**
 * Normalizes a VIAF ID by removing extraneous characters and whitespace.
 * @param viafId - The VIAF ID string to normalize.
 * @returns string - The normalized VIAF ID.
 */
export function normalizeViafId(viafId: string): string {
  return viafId.replace(/\D/g, '').trim();
}
```

---

#### 3. Verifier

Use the **VIAF API** to check if the ID exists.

```typescript
/**
 * Verifies a VIAF ID using the VIAF API.
 * @param viafId - The VIAF ID to verify.
 * @returns Promise<boolean> - True if the VIAF ID exists, otherwise false.
 */
export async function verifyViafId(viafId: string): Promise<boolean> {
  const normalizedId = normalizeViafId(viafId);

  try {
    const response = await fetch(
      `https://viaf.org/viaf/${encodeURIComponent(normalizedId)}/json/`
    );

    if (!response.ok) return false;

    const data = await response.json();
    return !!data.viafID; // Check if the "viafID" field exists in the response
  } catch {
    return false;
  }
}
```

---

### Example Usage

```typescript
import {
  validateViafId,
  normalizeViafId,
  verifyViafId,
} from './viafUtils.ts';

const viafId = " 123456789 ";

// Validate
const isValid = validateViafId(viafId);
console.log(`Is valid VIAF ID: ${isValid}`);

// Normalize
const normalizedId = normalizeViafId(viafId);
console.log(`Normalized VIAF ID: ${normalizedId}`);

// Verify
verifyViafId(normalizedId).then((exists) => {
  console.log(`VIAF ID exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **VIAF Specification**
- VIAF IDs themselves are identifiers in the public domain. Using, validating, or normalizing them does not require explicit permissions.

#### 2. **VIAF API Usage**
- The VIAF service is provided by OCLC.
- Review the [OCLC Terms and Conditions](https://www.oclc.org/en/policies/terms.html) for guidelines on API usage.
- VIAF metadata and identifiers are freely accessible for research and non-commercial use. Attribution to VIAF or OCLC is encouraged.

#### 3. **Redistributing Your Code**
- If publishing or sharing your implementation:
  - Use a permissive license like MIT or Apache 2.0.
  - Attribute any external libraries or services used (e.g., VIAF API).

---

This approach ensures compliance with VIAF standards while providing robust validation, normalization, and verification functions for Deno and TypeScript.

## 31. How do I write a validator, verifier and normalize functions for SNAC ID in Deno and TypeScript? What is the copyright or attribution requirements to use this code?

### Writing Validator, Verifier, and Normalize Functions for **SNAC ID** in Deno and TypeScript

**SNAC IDs** (Social Networks and Archival Context identifiers) are unique identifiers assigned to records in the SNAC database, which links archival collections to their associated individuals, families, and organizations.

---

### Overview of SNAC ID

1. **Format**:
   - SNAC IDs are numeric strings.
   - They typically range from 1 to 8 digits (e.g., `123456`).

2. **Validation**:
   - Ensure the identifier contains only digits.
   - Verify the length is within expected bounds.

3. **Normalization**:
   - Remove extraneous spaces or non-numeric characters.
   - Ensure the output is a pure numeric string.

4. **Verification**:
   - Use the SNAC API or the SNAC website to verify the ID's existence and potentially retrieve related metadata.

---

### Implementation in TypeScript

#### 1. Validator

```typescript
/**
 * Validates a SNAC ID for format correctness.
 * @param snacId - The SNAC ID string to validate.
 * @returns boolean - True if valid, otherwise false.
 */
export function validateSnacId(snacId: string): boolean {
  const normalizedId = normalizeSnacId(snacId);
  return /^\d{1,8}$/.test(normalizedId);
}
```

---

#### 2. Normalizer

```typescript
/**
 * Normalizes a SNAC ID by removing extraneous characters and spaces.
 * @param snacId - The SNAC ID string to normalize.
 * @returns string - The normalized SNAC ID.
 */
export function normalizeSnacId(snacId: string): string {
  return snacId.replace(/\D/g, '').trim();
}
```

---

#### 3. Verifier

You can query the **SNAC API** or use a direct URL lookup for verification. The SNAC web interface uses URLs like `https://snaccooperative.org/view/{SNAC_ID}`.

```typescript
/**
 * Verifies a SNAC ID using the SNAC web API.
 * @param snacId - The SNAC ID to verify.
 * @returns Promise<boolean> - True if the SNAC ID exists, otherwise false.
 */
export async function verifySnacId(snacId: string): Promise<boolean> {
  const normalizedId = normalizeSnacId(snacId);

  try {
    const response = await fetch(
      `https://snaccooperative.org/view/${encodeURIComponent(normalizedId)}`
    );

    // A valid SNAC ID will return a 200 response with the expected SNAC page.
    return response.ok;
  } catch {
    return false;
  }
}
```

---

### Example Usage

```typescript
import {
  validateSnacId,
  normalizeSnacId,
  verifySnacId,
} from './snacUtils.ts';

const snacId = " 123456 ";

// Validate
const isValid = validateSnacId(snacId);
console.log(`Is valid SNAC ID: ${isValid}`);

// Normalize
const normalizedId = normalizeSnacId(snacId);
console.log(`Normalized SNAC ID: ${normalizedId}`);

// Verify
verifySnacId(normalizedId).then((exists) => {
  console.log(`SNAC ID exists: ${exists}`);
});
```

---

### Copyright and Attribution Requirements

#### 1. **SNAC Specification**
- SNAC IDs themselves are in the public domain and can be freely used without specific permissions.

#### 2. **SNAC API or Data Usage**
- The **SNAC Cooperative** provides access to its API and metadata. Refer to their [terms of use](https://snaccooperative.org/terms) for specific usage policies.
- If you use their API or data for public-facing projects, attribution to the SNAC Cooperative is recommended.

#### 3. **Redistributing Your Code**
- If distributing your implementation:
  - Use a permissive license like MIT or Apache 2.0.
  - Attribute any third-party tools or resources, including the SNAC API if used for verification.

---

This implementation ensures proper handling of SNAC IDs with validation, normalization, and verification functionalities. It also complies with SNAC's guidelines for metadata usage and attribution.
