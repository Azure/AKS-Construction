import * as React from 'react';
import { useConst } from './useConst';
/**
 *  Returns a wrapper function for `setInterval` which automatically handles disposal.
 */
export var useSetInterval = function () {
    var intervalIds = useConst({});
    React.useEffect(function () { return function () {
        for (var _i = 0, _a = Object.keys(intervalIds); _i < _a.length; _i++) {
            var id = _a[_i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clearInterval(id);
        }
    }; }, 
    // useConst ensures this will never change, but react-hooks/exhaustive-deps doesn't know that
    [intervalIds]);
    return useConst({
        setInterval: function (func, duration) {
            var id = setInterval(func, duration);
            intervalIds[id] = 1;
            return id;
        },
        clearInterval: function (id) {
            delete intervalIds[id];
            clearInterval(id);
        },
    });
};
//# sourceMappingURL=useSetInterval.js.map