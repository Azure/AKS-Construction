import { IStyleSet } from './IStyleSet';
import { IStyleFunctionOrObject } from './IStyleFunction';
import { DeepPartial } from './DeepPartial';
/**
 * Concatenates style sets into one, but resolves functional sets using the given props.
 * @param styleProps - Props used to resolve functional sets.
 * @param allStyles - Style sets, which can be functions or objects.
 */
export declare function concatStyleSetsWithProps<TStyleProps, TStyleSet extends IStyleSet<TStyleSet>>(styleProps: TStyleProps, ...allStyles: (IStyleFunctionOrObject<TStyleProps, TStyleSet> | undefined)[]): DeepPartial<TStyleSet>;
