import * as React from 'react';
import { useConst } from './useConst';
/**
 * Hook to force update a function component by updating a dummy state.
 */
export function useForceUpdate() {
    var _a = React.useState(0), setValue = _a[1];
    var forceUpdate = useConst(function () { return function () { return setValue(function (value) { return ++value; }); }; });
    return forceUpdate;
}
//# sourceMappingURL=useForceUpdate.js.map