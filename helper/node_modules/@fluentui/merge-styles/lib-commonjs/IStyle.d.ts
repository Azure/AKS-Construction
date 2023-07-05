import { IRawStyle } from './IRawStyle';
/**
 * {@docCategory IStyleBase}
 */
export declare type IStyleBase = IRawStyle | string | false | null | undefined;
/**
 * {@docCategory IStyleBaseArray}
 */
export interface IStyleBaseArray extends Array<IStyle> {
}
/**
 * IStyleObject extends a raw style objects, but allows selectors to be defined
 * under the selectors node.
 * @public
 * {@docCategory IStyle}
 */
export declare type IStyle = IStyleBase | IStyleBaseArray;
