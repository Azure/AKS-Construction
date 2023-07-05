define(["require", "exports", "tslib"], function (require, exports, tslib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeScopedSettings = exports.mergeSettings = void 0;
    /**
     * Merge new and old settings, giving priority to new settings.
     * New settings is optional in which case oldSettings is returned as-is.
     * @param oldSettings - Old settings to fall back to.
     * @param newSettings - New settings that will be merged over oldSettings.
     * @returns Merged settings.
     */
    function mergeSettings(oldSettings, newSettings) {
        if (oldSettings === void 0) { oldSettings = {}; }
        var mergeSettingsWith = _isSettingsFunction(newSettings) ? newSettings : _settingsMergeWith(newSettings);
        return mergeSettingsWith(oldSettings);
    }
    exports.mergeSettings = mergeSettings;
    function mergeScopedSettings(oldSettings, newSettings) {
        if (oldSettings === void 0) { oldSettings = {}; }
        var mergeSettingsWith = _isSettingsFunction(newSettings) ? newSettings : _scopedSettingsMergeWith(newSettings);
        return mergeSettingsWith(oldSettings);
    }
    exports.mergeScopedSettings = mergeScopedSettings;
    function _isSettingsFunction(settings) {
        return typeof settings === 'function';
    }
    function _settingsMergeWith(newSettings) {
        return function (settings) { return (newSettings ? tslib_1.__assign(tslib_1.__assign({}, settings), newSettings) : settings); };
    }
    function _scopedSettingsMergeWith(scopedSettingsFromProps) {
        if (scopedSettingsFromProps === void 0) { scopedSettingsFromProps = {}; }
        return function (oldScopedSettings) {
            var newScopedSettings = tslib_1.__assign({}, oldScopedSettings);
            for (var scopeName in scopedSettingsFromProps) {
                if (scopedSettingsFromProps.hasOwnProperty(scopeName)) {
                    newScopedSettings[scopeName] = tslib_1.__assign(tslib_1.__assign({}, oldScopedSettings[scopeName]), scopedSettingsFromProps[scopeName]);
                }
            }
            return newScopedSettings;
        };
    }
});
//# sourceMappingURL=mergeSettings.js.map