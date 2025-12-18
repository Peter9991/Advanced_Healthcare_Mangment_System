/**
 * Validates and converts a string ID to a number
 * @param id - The ID string to validate
 * @returns The validated number ID, or null if invalid
 */
export const validateId = (id: string): number | null => {
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) {
    return null;
  }
  return numId;
};

