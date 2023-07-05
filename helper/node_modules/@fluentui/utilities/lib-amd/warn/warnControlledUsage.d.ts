/** Reset controlled usage warnings for testing purposes. */
export declare function resetControlledWarnings(): void;
export interface IWarnControlledUsageParams<P> {
    /** ID of the component instance. Used to prevent showing warnings repeatedly. */
    componentId: string;
    /** Name of the component class. */
    componentName: string;
    /** Current props to evaluate. */
    props: P;
    /** Previous props to evaluate (undefined if called in the constructor). */
    oldProps?: P;
    /** Name of the prop for the controlled value. */
    valueProp: keyof P;
    /** Name of the prop for the uncontrolled initial value. */
    defaultValueProp: keyof P;
    /** Name of the change handler prop. */
    onChangeProp: keyof P;
    /** Name of the read-only prop. */
    readOnlyProp?: keyof P;
}
/**
 * Check for and warn on the following error conditions with a form component:
 * - A value prop is provided (indicated it's being used as controlled) without a change handler,
 *    and the component is not read-only
 * - Both the value and defaultValue props are provided
 * - The component is attempting to switch between controlled and uncontrolled
 *
 * The messages mimic the warnings React gives for these error conditions on input elements.
 * The warning will only be displayed once per component ID.
 */
export declare function warnControlledUsage<P>(params: IWarnControlledUsageParams<P>): void;
