"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCustomizations = void 0;
var mergeSettings_1 = require("./mergeSettings");
/**
 * Merge props and customizations giving priority to props over context.
 * NOTE: This function will always perform multiple merge operations. Use with caution.
 * @param props - New settings to merge in.
 * @param parentContext - Context containing current settings.
 * @returns Merged customizations.
 */
function mergeCustomizations(props, parentContext) {
    var _a = (parentContext || {}).customizations, customizations = _a === void 0 ? { settings: {}, scopedSettings: {} } : _a;
    return {
        customizations: {
            settings: mergeSettings_1.mergeSettings(customizations.settings, props.settings),
            scopedSettings: mergeSettings_1.mergeScopedSettings(customizations.scopedSettings, props.scopedSettings),
            inCustomizerContext: true,
        },
    };
}
exports.mergeCustomizations = mergeCustomizations;
//# sourceMappingURL=mergeCustomizations.js.map