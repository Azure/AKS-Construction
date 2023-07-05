/**
 * An array of events that are allowed on every html element type.
 *
 * @public
 */
export declare const baseElementEvents: Record<string, number>;
/**
 * An array of element attributes which are allowed on every html element type.
 *
 * @public
 */
export declare const baseElementProperties: Record<string, number>;
/**
 * An array of HTML element properties and events.
 *
 * @public
 */
export declare const htmlElementProperties: Record<string, number>;
/**
 * An array of LABEL tag properties and events.
 *
 * @public
 */
export declare const labelProperties: Record<string, number>;
/**
 * An array of AUDIO tag properties and events.

 * @public
 */
export declare const audioProperties: Record<string, number>;
/**
 * An array of VIDEO tag properties and events.
 *
 * @public
 */
export declare const videoProperties: Record<string, number>;
/**
 * An array of OL tag properties and events.
 *
 * @public
 */
export declare const olProperties: Record<string, number>;
/**
 * An array of LI tag properties and events.
 *
 * @public
 */
export declare const liProperties: Record<string, number>;
/**
 * An array of A tag properties and events.
 *
 * @public
 */
export declare const anchorProperties: Record<string, number>;
/**
 * An array of BUTTON tag properties and events.
 *
 * @public
 */
export declare const buttonProperties: Record<string, number>;
/**
 * An array of INPUT tag properties and events.
 *
 * @public
 */
export declare const inputProperties: Record<string, number>;
/**
 * An array of TEXTAREA tag properties and events.
 *
 * @public
 */
export declare const textAreaProperties: Record<string, number>;
/**
 * An array of SELECT tag properties and events.
 *
 * @public
 */
export declare const selectProperties: Record<string, number>;
export declare const optionProperties: Record<string, number>;
/**
 * An array of TABLE tag properties and events.
 *
 * @public
 */
export declare const tableProperties: Record<string, number>;
/**
 * An array of TR tag properties and events.
 *
 * @public
 */
export declare const trProperties: Record<string, number>;
/**
 * An array of TH tag properties and events.
 *
 * @public
 */
export declare const thProperties: Record<string, number>;
/**
 * An array of TD tag properties and events.
 *
 * @public
 */
export declare const tdProperties: Record<string, number>;
export declare const colGroupProperties: Record<string, number>;
export declare const colProperties: Record<string, number>;
/**
 * An array of FORM tag properties and events.
 *
 * @public
 */
export declare const formProperties: Record<string, number>;
/**
 * An array of IFRAME tag properties and events.
 *
 * @public
 */
export declare const iframeProperties: Record<string, number>;
/**
 * An array of IMAGE tag properties and events.
 *
 * @public
 */
export declare const imgProperties: Record<string, number>;
/**
 * @deprecated Use imgProperties for img elements.
 */
export declare const imageProperties: Record<string, number>;
/**
 * An array of DIV tag properties and events.
 *
 * @public
 */
export declare const divProperties: Record<string, number>;
/**
 * Gets native supported props for an html element provided the allowance set. Use one of the property
 * sets defined (divProperties, buttonPropertes, etc) to filter out supported properties from a given
 * props set. Note that all data- and aria- prefixed attributes will be allowed.
 * NOTE: getNativeProps should always be applied first when adding props to a react component. The
 * non-native props should be applied second. This will prevent getNativeProps from overriding your custom props.
 * For example, if props passed to getNativeProps has an onClick function and getNativeProps is added to
 * the component after an onClick function is added, then the getNativeProps onClick will override it.
 *
 * @public
 * @param props - The unfiltered input props
 * @param allowedPropsNames - The array or record of allowed prop names.
 * @returns The filtered props
 */
export declare function getNativeProps<T extends Record<string, any>>(props: Record<string, any>, allowedPropNames: string[] | Record<string, number>, excludedPropNames?: string[]): T;
