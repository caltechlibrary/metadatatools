export const ARXIVPattern =
  "^arxiv:(\\d{4}\\.\\d{4,5}(v\\d+)?|[a-z\\-]+\\/\\d{7}(v\\d+)?)$";
export const reARXIV = new RegExp(ARXIVPattern, "i");
export const newARXIVPattern = "^arxiv:\\d{4}\\.\\d{4,5}(v\\d+)?$";
export const reNewARXIV = new RegExp(newARXIVPattern, "i");
export const oldARXIVPattern = "^arxiv:[a-z\\-]+\\/\\d{7}(v\\d+)?$";
export const reOldARXIV = new RegExp(oldARXIVPattern, "i");

export function normalizeArXivID(arxivID: string): string {
  return arxivID.trim().toLowerCase();
}

export function validateArXivID(arxivID: string): boolean {
  const normalizedID = normalizeArXivID(arxivID);
  return reARXIV.test(normalizedID);
}
