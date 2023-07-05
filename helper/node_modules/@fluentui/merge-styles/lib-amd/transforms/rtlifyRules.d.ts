import { IStyleOptions } from '../IStyleOptions';
/**
 * RTLifies the rulePair in the array at the current index. This mutates the array for performance
 * reasons.
 */
export declare function rtlifyRules(options: IStyleOptions, rulePairs: (string | number)[], index: number): void;
