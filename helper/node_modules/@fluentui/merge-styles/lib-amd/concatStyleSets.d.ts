import { IStyleSet, IConcatenatedStyleSet } from './IStyleSet';
import { ObjectOnly } from './ObjectOnly';
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet - The first style set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet>(styleSet: TStyleSet | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet1 - The first style set to be concatenated.
 * @param styleSet2 - The second style set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet1, TStyleSet2>(styleSet1: TStyleSet1 | false | null | undefined, styleSet2: TStyleSet2 | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet1> & ObjectOnly<TStyleSet2>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet1 - The first style set to be concatenated.
 * @param styleSet2 - The second style set to be concatenated.
 * @param styleSet3 - The third style set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet1, TStyleSet2, TStyleSet3>(styleSet1: TStyleSet1 | false | null | undefined, styleSet2: TStyleSet2 | false | null | undefined, styleSet3: TStyleSet3 | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet1> & ObjectOnly<TStyleSet2> & ObjectOnly<TStyleSet3>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet1 - The first style set to be concatenated.
 * @param styleSet2 - The second style set to be concatenated.
 * @param styleSet3 - The third style set to be concatenated.
 * @param styleSet4 - The fourth style set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet1, TStyleSet2, TStyleSet3, TStyleSet4>(styleSet1: TStyleSet1 | false | null | undefined, styleSet2: TStyleSet2 | false | null | undefined, styleSet3: TStyleSet3 | false | null | undefined, styleSet4: TStyleSet4 | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet1> & ObjectOnly<TStyleSet2> & ObjectOnly<TStyleSet3> & ObjectOnly<TStyleSet4>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet1 - The first style set to be concatenated.
 * @param styleSet2 - The second style set to be concatenated.
 * @param styleSet3 - The third style set to be concatenated.
 * @param styleSet4 - The fourth style set to be concatenated.
 * @param styleSet5 - The fifth set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet1, TStyleSet2, TStyleSet3, TStyleSet4, TStyleSet5>(styleSet1: TStyleSet1 | false | null | undefined, styleSet2: TStyleSet2 | false | null | undefined, styleSet3: TStyleSet3 | false | null | undefined, styleSet4: TStyleSet4 | false | null | undefined, styleSet5: TStyleSet5 | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet1> & ObjectOnly<TStyleSet2> & ObjectOnly<TStyleSet3> & ObjectOnly<TStyleSet4> & ObjectOnly<TStyleSet5>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSet1 - The first style set to be concatenated.
 * @param styleSet2 - The second style set to be concatenated.
 * @param styleSet3 - The third style set to be concatenated.
 * @param styleSet4 - The fourth style set to be concatenated.
 * @param styleSet5 - The fifth set to be concatenated.
 * @param styleSet6 - The sixth set to be concatenated.
 */
export declare function concatStyleSets<TStyleSet1, TStyleSet2, TStyleSet3, TStyleSet4, TStyleSet5, TStyleSet6>(styleSet1: TStyleSet1 | false | null | undefined, styleSet2: TStyleSet2 | false | null | undefined, styleSet3: TStyleSet3 | false | null | undefined, styleSet4: TStyleSet4 | false | null | undefined, styleSet5: TStyleSet5 | false | null | undefined, styleSet6: TStyleSet6 | false | null | undefined): IConcatenatedStyleSet<ObjectOnly<TStyleSet1> & ObjectOnly<TStyleSet2> & ObjectOnly<TStyleSet3> & ObjectOnly<TStyleSet4> & ObjectOnly<TStyleSet5> & ObjectOnly<TStyleSet6>>;
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSets - One or more stylesets to be merged (each param can also be falsy).
 */
export declare function concatStyleSets(...styleSets: (IStyleSet | false | null | undefined)[]): IConcatenatedStyleSet<any>;
