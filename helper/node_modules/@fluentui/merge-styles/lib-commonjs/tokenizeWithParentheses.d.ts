/**
 * Split a string into tokens separated by whitespace, except all text within parentheses
 * is treated as a single token (whitespace is ignored within parentheses).
 *
 * Unlike String.split(' '), multiple consecutive space characters are collapsed and
 * removed from the returned array (including leading and trailing spaces).
 *
 * For example:
 * `tokenizeWithParentheses("3px calc(var(--x) / 2) 9px    0 ")`
 *   => `["3px", "calc(var(--x) / 2)", "9px", "0"]`
 *
 * @returns The array of tokens. Returns an empty array if the string was empty or contained only whitespace.
 */
export declare function tokenizeWithParentheses(value: string): string[];
