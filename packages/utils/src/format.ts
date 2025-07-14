// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Formats a number to a more human-readable format, using compact notation
 * @param value The number to format
 * @returns The formatted number
 */
export const numericFormatter = (value: number): string => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Format a number according to the current locale
 * @param value - The number to format
 * @param locale - The locale to use (e.g., 'en-US', 'de-DE')
 * @param options - Optional Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumberOrString(
  value: unknown,
  locale: string,
  options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  }
) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, options).format(value);
  }
  return value;
}
