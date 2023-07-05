"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomizationSettings = void 0;
var React = require("react");
var Customizations_1 = require("./Customizations");
var CustomizerContext_1 = require("./CustomizerContext");
/**
 * Hook to get Customizations settings from Customizations singleton or CustomizerContext.
 * It will trigger component state update on settings change observed.
 */
function useCustomizationSettings(properties, scopeName) {
    var forceUpdate = useForceUpdate();
    var customizations = React.useContext(CustomizerContext_1.CustomizerContext).customizations;
    var inCustomizerContext = customizations.inCustomizerContext;
    React.useEffect(function () {
        if (!inCustomizerContext) {
            Customizations_1.Customizations.observe(forceUpdate);
        }
        return function () {
            if (!inCustomizerContext) {
                Customizations_1.Customizations.unobserve(forceUpdate);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- exclude forceUpdate
    }, [inCustomizerContext]);
    return Customizations_1.Customizations.getSettings(properties, scopeName, customizations);
}
exports.useCustomizationSettings = useCustomizationSettings;
function useForceUpdate() {
    var _a = React.useState(0), setValue = _a[1];
    return function () { return setValue(function (value) { return ++value; }); };
}
//# sourceMappingURL=useCustomizationSettings.js.map