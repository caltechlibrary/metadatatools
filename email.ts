export const EMAILPattern: string = '^(?:"?([^"]*)"?\\s)?(?:<?(.+@[^>]+)>?)$';
export const reEMAIL: RegExp = new RegExp(EMAILPattern);

export function normalizeEMAIL(email: string): string {
  return email.trim().replaceAll(/\s+/g, "").trim();
}

export function validateEMAIL(email: string): boolean {
  const normalized = normalizeEMAIL(email);
  return reEMAIL.test(normalized);
}
