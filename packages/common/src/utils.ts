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
 * Generates a random ID, which is a string of 13 characters
 * @returns A random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}
