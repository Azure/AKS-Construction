/**
 * Dictionary of booleans.
 *
 * @internal
 */
export interface IDictionary {
    [className: string]: boolean;
}
/**
 * Serializable object.
 *
 * @internal
 */
export interface ISerializableObject {
    toString?: () => string;
}
/**
 * css input type.
 *
 * @internal
 */
export declare type ICssInput = string | ISerializableObject | IDictionary | null | undefined | boolean;
/**
 * Concatination helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
export declare function css(...args: ICssInput[]): string;
