// Capitalize the first letter of every word, including after common separators
// such as spaces, hyphens, slashes, and parentheses. Preserve the rest of the
// characters as-is to avoid breaking acronyms like "PR" or units like "1RM".
export function formatExerciseName(name: string): string {
  const trimmed = name.trim();
  if (trimmed === '') return trimmed;
  // Uppercase letter at start of string or right after these separators
  // Space, tab, newline, hyphen, slash, parentheses, brackets, braces, colon,
  // comma, underscore, plus
  return trimmed.replace(
    /(^|[\s\-\/()\[\]{}:,_+])([a-zA-Z])/g,
    (_m, sep: string, c: string) => sep + c.toUpperCase(),
  );
}
