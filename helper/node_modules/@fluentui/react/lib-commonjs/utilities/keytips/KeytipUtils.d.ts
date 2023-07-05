/**
 * Converts a whole set of KeySequences into one keytip ID, which will be the ID for the last keytip sequence specified
 * keySequences should not include the initial keytip 'start' sequence.
 *
 * @param keySequences - Full path of IKeySequences for one keytip.
 * @returns String to use for the keytip ID.
 */
export declare function sequencesToID(keySequences: string[]): string;
/**
 * Merges an overflow sequence with a key sequence.
 *
 * @param keySequences - Full sequence for one keytip.
 * @param overflowKeySequences - Full overflow keytip sequence.
 * @returns Sequence that will be used by the keytip when in the overflow.
 */
export declare function mergeOverflows(keySequences: string[], overflowKeySequences: string[]): string[];
/**
 * Constructs the data-ktp-target attribute selector from a full key sequence.
 *
 * @param keySequences - Full string[] for a Keytip.
 * @returns String selector to use to query for the keytip target.
 */
export declare function ktpTargetFromSequences(keySequences: string[]): string;
/**
 * Constructs the data-ktp-execute-target attribute selector from a keytip ID.
 *
 * @param keytipId - ID of the Keytip.
 * @returns String selector to use to query for the keytip execute target.
 */
export declare function ktpTargetFromId(keytipId: string): string;
/**
 * Gets the aria-describedby value to put on the component with this keytip.
 *
 * @param keySequences - KeySequences of the keytip.
 * @returns The aria-describedby value to set on the component with this keytip.
 */
export declare function getAriaDescribedBy(keySequences: string[]): string;
