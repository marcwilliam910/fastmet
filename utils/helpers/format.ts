export function formatPHNumber(input: string) {
  if (!input) return "";

  // Strip non-digits
  let digits = input.replace(/\D/g, "");

  // Normalize to 0XXXXXXXXXX
  if (digits.startsWith("63")) {
    digits = "0" + digits.slice(2);
  } else if (digits.startsWith("9") && digits.length === 10) {
    digits = "0" + digits;
  }

  // Validate PH mobile format (11 digits starting with 09)
  if (!/^09\d{9}$/.test(digits)) {
    return input;
  }

  // Format: 0XXX-XXX-XXXX
  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
}
