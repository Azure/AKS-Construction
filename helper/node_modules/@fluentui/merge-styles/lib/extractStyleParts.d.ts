import { IStyle, IStyleBaseArray } from './IStyle';
/**
 * Separates the classes and style objects. Any classes that are pre-registered
 * args are auto expanded into objects.
 */
export declare function extractStyleParts(...args: (IStyle | IStyle[] | false | null | undefined)[]): {
    classes: string[];
    objects: IStyleBaseArray;
};
