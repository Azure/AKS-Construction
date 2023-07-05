import { IStyle, IStyleBaseArray } from './IStyle';
import { IStyleOptions } from './IStyleOptions';
/**
 * Concatenation helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
export declare function mergeStyles(...args: (IStyle | IStyleBaseArray | false | null | undefined)[]): string;
/**
 * Concatenation helper, which can merge class names together. Skips over falsey values.
 * Accepts a set of options that will be used when calculating styles.
 *
 * @public
 */
export declare function mergeCss(args: (IStyle | IStyleBaseArray | false | null | undefined) | (IStyle | IStyleBaseArray | false | null | undefined)[], options?: IStyleOptions): string;
