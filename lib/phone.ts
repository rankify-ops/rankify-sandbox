/**
 * Australian phone numbers for lead forms: mobiles (04) and landlines (02, 03, 07, 08).
 * Numbers are stored in national format without spaces, e.g. 0412345678.
 */
export type PhoneKind = "mobile" | "landline";

/** Strip spaces and punctuation, and turn +61 / 61 / +61 (0) into a leading 0. */
export function normaliseAuPhone(raw: string) {
  const digits = raw.trim().replace(/[\s().\-]/g, "");
  const intl = digits.match(/^\+?610?(\d{9})$/);
  return intl ? "0" + intl[1] : digits;
}

export function phoneKind(n: string): PhoneKind | null {
  if (/^04\d{8}$/.test(n)) return "mobile";
  if (/^0[2378]\d{8}$/.test(n)) return "landline";
  return null;
}

/** Obvious made-up numbers (all one digit, or counting up), which installers can't call. */
function looksFake(n: string) {
  const rest = n.slice(2);
  return /^(\d)\1+$/.test(rest) || n === "0412345678" || rest === "12345678";
}

/** Why a number isn't a valid AU mobile or landline, or null if it is. Expects a normalised number. */
export function phoneError(n: string): string | null {
  if (n === "") return "Enter your phone number";
  if (!/^\d+$/.test(n)) return "Use digits only, e.g. 0412 345 678";
  if (/^1[38]/.test(n)) return "Please use a mobile or landline, not a 13, 1300 or 1800 number";
  if (/^04/.test(n)) {
    if (n.length !== 10) return "Mobile numbers have 10 digits, e.g. 0412 345 678";
  } else if (/^0[2378]/.test(n)) {
    if (n.length !== 10) return "Landlines need the area code and 8 digits, e.g. 02 9123 4567";
  } else if (/^[2-9]\d{7}$/.test(n)) {
    return "Add your area code (02, 03, 07 or 08), e.g. 02 9123 4567";
  } else {
    return "Enter an Australian mobile (04) or landline (02, 03, 07, 08)";
  }
  if (looksFake(n)) return "Please enter a number the installer can reach you on";
  return null;
}

/** Display format: 0412 345 678 for mobiles, 02 9123 4567 for landlines. Leaves anything else as typed. */
export function formatAuPhone(raw: string) {
  const n = normaliseAuPhone(raw);
  const kind = phoneKind(n);
  if (kind === "mobile") return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (kind === "landline") return `${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6)}`;
  return raw;
}
