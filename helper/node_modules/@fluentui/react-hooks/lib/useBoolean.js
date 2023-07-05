import * as React from 'react';
import { useConst } from './useConst';
/**
 * Hook to store a value and generate callbacks for setting the value to true or false.
 * The identity of the callbacks will always stay the same.
 *
 * @param initialState - Initial value
 * @returns Array with the current value and an object containing the updater callbacks.
 */
export function useBoolean(initialState) {
    var _a = React.useState(initialState), value = _a[0], setValue = _a[1];
    var setTrue = useConst(function () { return function () {
        setValue(true);
    }; });
    var setFalse = useConst(function () { return function () {
        setValue(false);
    }; });
    var toggle = useConst(function () { return function () {
        setValue(function (currentValue) { return !currentValue; });
    }; });
    return [value, { setTrue: setTrue, setFalse: setFalse, toggle: toggle }];
}
//# sourceMappingURL=useBoolean.js.map