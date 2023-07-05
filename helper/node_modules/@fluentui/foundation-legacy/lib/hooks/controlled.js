import * as React from 'react';
/**
 * Controlled state helper that gives priority to props value. Useful for components that have props with both
 * controlled and uncontrolled modes. Any props values will override state, but will not update internal state.
 * If prop is defined and then later undefined, state will revert to its previous value.
 *
 * @param props - The props object containing controlled prop values.
 * @param propName - The controlled prop name.
 * @param options - Options. defaultPropValue is only used if defaultPropName (or its value) is undefined.
 */
export function useControlledState(props, propName, options) {
    var defaultValue;
    if (options) {
        if (options.defaultPropName && props[options.defaultPropName] !== undefined) {
            // No easy way to coerce TProps[TDefaultProp] to match TProps[TProp] in generic typings, so cast it here.
            defaultValue = props[options.defaultPropName];
        }
        else {
            defaultValue = options && options.defaultPropValue;
        }
    }
    var _a = React.useState(defaultValue), state = _a[0], setState = _a[1];
    if (props[propName] !== undefined) {
        return [props[propName], setState];
    }
    else {
        return [state, setState];
    }
}
/**
 * Simple controlled helper that gives priority to props value and falls back to derived value.
 *
 * @param props - The props object containing controlled prop values.
 * @param propName - The controlled prop name.
 * @param derivedValue - Derived value. Returned when controlled value is not present.
 */
export function getControlledDerivedProps(props, propName, derivedValue) {
    if (props[propName] !== undefined) {
        return props[propName];
    }
    else {
        return derivedValue;
    }
}
//# sourceMappingURL=controlled.js.map