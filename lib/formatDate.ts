// lib/formatDate.ts

/**
 * Formats a Firestore Timestamp, Date, or string to a readable date string.
 * @param input - Firestore Timestamp, Date, or string
 * @param options - Intl.DateTimeFormat options
 * @param locale - Locale string (default: 'en-US')
 */
export function formatDate(
  input: any,
  options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" },
  locale = "en-US"
): string {
  if (!input) return "";
  let date: Date;
  if (input.toDate) {
    date = input.toDate();
  } else if (input.seconds) {
    date = new Date(input.seconds * 1000);
  } else if (typeof input === "string" || typeof input === "number") {
    date = new Date(input);
  } else {
    date = input;
  }
  return new Intl.DateTimeFormat(locale, options).format(date);
}
