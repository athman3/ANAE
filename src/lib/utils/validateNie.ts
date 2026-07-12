const LETTER_TABLE = 'TRWAGMYFPDXBNJZSQVHLCKE';

export const NIE_FORMAT_REGEX = /^[XYZ]\d{7}[A-Z]$/i;
export const DNI_FORMAT_REGEX = /^\d{8}[A-Z]$/i;
export const NIE_OR_DNI_FORMAT_REGEX = /^([XYZ]\d{7}[A-Z]|\d{8}[A-Z])$/i;

export function validateNie(raw: string): boolean {
  const value = raw.trim().toUpperCase();

  if (!NIE_OR_DNI_FORMAT_REGEX.test(value)) return false;

  let numStr = value.slice(0, -1);
  const providedLetter = value.slice(-1);

  if (numStr[0] === 'X') numStr = '0' + numStr.slice(1);
  else if (numStr[0] === 'Y') numStr = '1' + numStr.slice(1);
  else if (numStr[0] === 'Z') numStr = '2' + numStr.slice(1);

  const num = parseInt(numStr, 10);
  if (isNaN(num)) return false;

  const expectedLetter = LETTER_TABLE[num % 23];
  return expectedLetter === providedLetter;
}
