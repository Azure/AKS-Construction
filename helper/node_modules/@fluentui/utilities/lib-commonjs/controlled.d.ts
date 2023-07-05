/**
 * Determines whether a component is controlled.
 * @param props - Component props
 * @param valueProp - Prop containing the controlled value
 * @returns true if controlled, false if uncontrolled
 */
export declare function isControlled<P>(props: P, valueProp: keyof P): boolean;
