import * as React from 'react';
import { Customizations } from './Customizations';
import { CustomizerContext } from './CustomizerContext';
/**
 * Hook to get Customizations settings from Customizations singleton or CustomizerContext.
 * It will trigger component state update on settings change observed.
 */
export function useCustomizationSettings(properties, scopeName) {
    var forceUpdate = useForceUpdate();
    var customizations = React.useContext(CustomizerContext).customizations;
    var inCustomizerContext = customizations.inCustomizerContext;
    React.useEffect(function () {
        if (!inCustomizerContext) {
            Customizations.observe(forceUpdate);
        }
        return function () {
            if (!inCustomizerContext) {
                Customizations.unobserve(forceUpdate);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- exclude forceUpdate
    }, [inCustomizerContext]);
    return Customizations.getSettings(properties, scopeName, customizations);
}
function useForceUpdate() {
    var _a = React.useState(0), setValue = _a[1];
    return function () { return setValue(function (value) { return ++value; }); };
}
//# sourceMappingURL=useCustomizationSettings.js.map