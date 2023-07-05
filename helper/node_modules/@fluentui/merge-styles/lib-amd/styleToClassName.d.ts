import { IStyle } from './IStyle';
import { IStyleOptions } from './IStyleOptions';
export declare function serializeRuleEntries(options: IStyleOptions, ruleEntries: {
    [key: string]: string | number;
}): string;
export interface IRegistration {
    className: string;
    key: string;
    args: IStyle[];
    rulesToInsert: string[];
}
export declare function styleToRegistration(options: IStyleOptions, ...args: IStyle[]): IRegistration | undefined;
/**
 * Insert style to stylesheet.
 * @param registration Style registration.
 * @param specificityMultiplier Number of times classname selector is repeated in the css rule.
 * This is to increase css specificity in case it's needed. Default to 1.
 */
export declare function applyRegistration(registration: IRegistration, specificityMultiplier?: number): void;
export declare function styleToClassName(options: IStyleOptions, ...args: IStyle[]): string;
