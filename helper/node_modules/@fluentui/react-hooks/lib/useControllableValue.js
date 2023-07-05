import * as React from 'react';
import { useConst } from './useConst';
export function useControllableValue(controlledValue, defaultUncontrolledValue, onChange) {
    var _a = React.useState(defaultUncontrolledValue), value = _a[0], setValue = _a[1];
    var isControlled = useConst(controlledValue !== undefined);
    var currentValue = isControlled ? controlledValue : value;
    // Duplicate the current value and onChange in refs so they're accessible from
    // setValueOrCallOnChange without creating a new callback every time
    var valueRef = React.useRef(currentValue);
    var onChangeRef = React.useRef(onChange);
    React.useEffect(function () {
        valueRef.current = currentValue;
        onChangeRef.current = onChange;
    });
    // To match the behavior of the setter returned by React.useState, this callback's identity
    // should never change. This means it MUST NOT directly reference variables that can change.
    var setValueOrCallOnChange = useConst(function () { return function (update, ev) {
        // Assuming here that TValue is not a function, because a controllable value will typically
        // be something a user can enter as input
        var newValue = typeof update === 'function' ? update(valueRef.current) : update;
        if (onChangeRef.current) {
            onChangeRef.current(ev, newValue);
        }
        if (!isControlled) {
            setValue(newValue);
        }
    }; });
    return [currentValue, setValueOrCallOnChange];
}
//# sourceMappingURL=useControllableValue.js.map