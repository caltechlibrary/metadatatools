

const newFormatPattern = /^arxiv:\d{4}\.\d{4,5}(v\d+)?$/i;
const oldFormatPattern = /^arxiv:[a-z\-]+\/\d{7}(v\d+)?$/i;


export function normalizeArXivID(arxivID: string): string {
    return arxivID.trim().toLowerCase();
}

export function validateArXivID(arxivID: string): boolean {
    const normalizedID = normalizeArXivID(arxivID);
    return newFormatPattern.test(normalizedID) || oldFormatPattern.test(normalizedID);
}