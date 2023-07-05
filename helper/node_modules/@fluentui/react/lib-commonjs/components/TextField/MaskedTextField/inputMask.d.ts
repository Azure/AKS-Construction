export interface IMaskValue {
    value?: string;
    /**
     * This index refers to the index in the displayMask rather than the inputMask.
     * This means that any escaped characters do not count toward this index.
     */
    displayIndex: number;
    format: RegExp;
}
export declare const DEFAULT_MASK_FORMAT_CHARS: {
    [key: string]: RegExp;
};
/**
 * Takes in the mask string and the formatCharacters and returns an array of MaskValues
 * Example:
 * mask = 'Phone Number: (999) - 9999'
 * return = [
 *    { value: undefined, displayIndex: 16, format: /[0-9]/ },
 *    { value: undefined, displayIndex: 17, format: /[0-9]/ },
 *    { value: undefined, displayIndex: 18, format: /[0-9]/ },
 *    { value: undefined, displayIndex: 22, format: /[0-9]/ },
 * ]
 *
 * @param mask The string use to define the format of the displayed maskedValue.
 * @param formatChars An object defining how certain characters in the mask should accept input.
 */
export declare function parseMask(mask: string | undefined, formatChars?: {
    [key: string]: RegExp;
}): IMaskValue[];
/**
 * Takes in the mask string, an array of MaskValues, and the maskCharacter
 * returns the mask string formatted with the input values and maskCharacter.
 * If the maskChar is undefined, the maskDisplay is truncated to the last filled format character.
 * Example:
 * mask = 'Phone Number: (999) 999 - 9999'
 * maskCharData = '12345'
 * maskChar = '_'
 * return = 'Phone Number: (123) 45_ - ___'
 *
 * Example:
 * mask = 'Phone Number: (999) 999 - 9999'
 * value = '12345'
 * maskChar = undefined
 * return = 'Phone Number: (123) 45'
 *
 * @param mask The string use to define the format of the displayed maskedValue.
 * @param maskCharData The input values to insert into the mask string for displaying.
 * @param maskChar? A character to display in place of unfilled mask format characters.
 */
export declare function getMaskDisplay(mask: string | undefined, maskCharData: IMaskValue[], maskChar?: string): string;
/**
 * Get the next format index right of or at a specified index.
 * If no index exists, returns the rightmost index.
 * @param maskCharData
 * @param index
 */
export declare function getRightFormatIndex(maskCharData: IMaskValue[], index: number): number;
/**
 * Get the next format index left of a specified index.
 * If no index exists, returns the leftmost index.
 * @param maskCharData
 * @param index
 */
export declare function getLeftFormatIndex(maskCharData: IMaskValue[], index: number): number;
/**
 * Deletes all values in maskCharData with a displayIndex that falls inside the specified range.
 * maskCharData is modified inline and also returned.
 * @param maskCharData
 * @param selectionStart
 * @param selectionCount
 */
export declare function clearRange(maskCharData: IMaskValue[], selectionStart: number, selectionCount: number): IMaskValue[];
/**
 * Deletes the input character at or after a specified index and returns the new array of charData
 * maskCharData is modified inline and also returned.
 * @param maskCharData
 * @param selectionStart
 */
export declare function clearNext(maskCharData: IMaskValue[], selectionStart: number): IMaskValue[];
/**
 * Deletes the input character before a specified index and returns the new array of charData
 * maskCharData is modified inline and also returned.
 * @param maskCharData
 * @param selectionStart
 */
export declare function clearPrev(maskCharData: IMaskValue[], selectionStart: number): IMaskValue[];
/**
 * Deletes all values in maskCharData with a displayIndex that falls inside the specified range.
 * Modifies the maskCharData inplace with the passed string and returns the display index of the
 * next format character after the inserted string.
 * @param maskCharData
 * @param selectionStart
 * @param selectionCount
 * @return The displayIndex of the next format character
 */
export declare function insertString(maskCharData: IMaskValue[], selectionStart: number, newString: string): number;
