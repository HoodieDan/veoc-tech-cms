
/**
 * Removes HTML tags from a string.
 * @param htmlString The string containing HTML.
 * @returns The string with HTML tags removed, or an empty string if input is null/undefined.
 */
export const stripHtml = (htmlString: string | null | undefined): string => {
  if (!htmlString) return "";
  // Use a regular expression to replace HTML tags with an empty string
  return htmlString.replace(/<[^>]*>/g, '');
};

// You might already have a truncateString function here too
export const truncateString = (str: string, num: number): string => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };
