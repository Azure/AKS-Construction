define(["require", "exports", "tslib", "@fluentui/utilities", "@fluentui/merge-styles"], function (require, exports, tslib_1, utilities_1, merge_styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setIconOptions = exports.getIcon = exports.registerIconAlias = exports.unregisterIcons = exports.registerIcons = void 0;
    var ICON_SETTING_NAME = 'icons';
    var _iconSettings = utilities_1.GlobalSettings.getValue(ICON_SETTING_NAME, {
        __options: {
            disableWarnings: false,
            warnOnMissingIcons: true,
        },
        __remapped: {},
    });
    // Reset icon registration on stylesheet resets.
    var stylesheet = merge_styles_1.Stylesheet.getInstance();
    if (stylesheet && stylesheet.onReset) {
        stylesheet.onReset(function () {
            for (var name_1 in _iconSettings) {
                if (_iconSettings.hasOwnProperty(name_1) && !!_iconSettings[name_1].subset) {
                    _iconSettings[name_1].subset.className = undefined;
                }
            }
        });
    }
    /**
     * Normalizes an icon name for consistent mapping.
     * Current implementation is to convert the icon name to lower case.
     *
     * @param name - Icon name to normalize.
     * @returns {string} Normalized icon name to use for indexing and mapping.
     */
    var normalizeIconName = function (name) { return name.toLowerCase(); };
    /**
     * Registers a given subset of icons.
     *
     * @param iconSubset - the icon subset definition.
     */
    function registerIcons(iconSubset, options) {
        var subset = tslib_1.__assign(tslib_1.__assign({}, iconSubset), { isRegistered: false, className: undefined });
        var icons = iconSubset.icons;
        // Grab options, optionally mix user provided ones on top.
        options = options ? tslib_1.__assign(tslib_1.__assign({}, _iconSettings.__options), options) : _iconSettings.__options;
        for (var iconName in icons) {
            if (icons.hasOwnProperty(iconName)) {
                var code = icons[iconName];
                var normalizedIconName = normalizeIconName(iconName);
                if (_iconSettings[normalizedIconName]) {
                    _warnDuplicateIcon(iconName);
                }
                else {
                    _iconSettings[normalizedIconName] = {
                        code: code,
                        subset: subset,
                    };
                }
            }
        }
    }
    exports.registerIcons = registerIcons;
    /**
     * Unregisters icons by name.
     *
     * @param iconNames - List of icons to unregister.
     */
    function unregisterIcons(iconNames) {
        var options = _iconSettings.__options;
        var _loop_1 = function (iconName) {
            var normalizedIconName = normalizeIconName(iconName);
            if (_iconSettings[normalizedIconName]) {
                delete _iconSettings[normalizedIconName];
            }
            else {
                // Warn that we are trying to delete an icon that doesn't exist
                if (!options.disableWarnings) {
                    utilities_1.warn("The icon \"" + iconName + "\" tried to unregister but was not registered.");
                }
            }
            // Delete any aliases for this iconName
            if (_iconSettings.__remapped[normalizedIconName]) {
                delete _iconSettings.__remapped[normalizedIconName];
            }
            // Delete any items that were an alias for this iconName
            Object.keys(_iconSettings.__remapped).forEach(function (key) {
                if (_iconSettings.__remapped[key] === normalizedIconName) {
                    delete _iconSettings.__remapped[key];
                }
            });
        };
        for (var _i = 0, iconNames_1 = iconNames; _i < iconNames_1.length; _i++) {
            var iconName = iconNames_1[_i];
            _loop_1(iconName);
        }
    }
    exports.unregisterIcons = unregisterIcons;
    /**
     * Remaps one icon name to another.
     */
    function registerIconAlias(iconName, mappedToName) {
        _iconSettings.__remapped[normalizeIconName(iconName)] = normalizeIconName(mappedToName);
    }
    exports.registerIconAlias = registerIconAlias;
    /**
     * Gets an icon definition. If an icon is requested but the subset has yet to be registered,
     * it will get registered immediately.
     *
     * @public
     * @param name - Name of icon.
     */
    function getIcon(name) {
        var icon = undefined;
        var options = _iconSettings.__options;
        name = name ? normalizeIconName(name) : '';
        name = _iconSettings.__remapped[name] || name;
        if (name) {
            icon = _iconSettings[name];
            if (icon) {
                var subset = icon.subset;
                if (subset && subset.fontFace) {
                    if (!subset.isRegistered) {
                        merge_styles_1.fontFace(subset.fontFace);
                        subset.isRegistered = true;
                    }
                    if (!subset.className) {
                        subset.className = merge_styles_1.mergeStyles(subset.style, {
                            fontFamily: subset.fontFace.fontFamily,
                            fontWeight: subset.fontFace.fontWeight || 'normal',
                            fontStyle: subset.fontFace.fontStyle || 'normal',
                        });
                    }
                }
            }
            else {
                // eslint-disable-next-line deprecation/deprecation
                if (!options.disableWarnings && options.warnOnMissingIcons) {
                    utilities_1.warn("The icon \"" + name + "\" was used but not registered. See https://github.com/microsoft/fluentui/wiki/Using-icons for more information.");
                }
            }
        }
        return icon;
    }
    exports.getIcon = getIcon;
    /**
     * Sets the icon options.
     *
     * @public
     */
    function setIconOptions(options) {
        _iconSettings.__options = tslib_1.__assign(tslib_1.__assign({}, _iconSettings.__options), options);
    }
    exports.setIconOptions = setIconOptions;
    var _missingIcons = [];
    var _missingIconsTimer = undefined;
    function _warnDuplicateIcon(iconName) {
        var options = _iconSettings.__options;
        var warningDelay = 2000;
        var maxIconsInMessage = 10;
        if (!options.disableWarnings) {
            _missingIcons.push(iconName);
            if (_missingIconsTimer === undefined) {
                _missingIconsTimer = setTimeout(function () {
                    utilities_1.warn("Some icons were re-registered. Applications should only call registerIcons for any given " +
                        "icon once. Redefining what an icon is may have unintended consequences. Duplicates " +
                        "include: \n" +
                        _missingIcons.slice(0, maxIconsInMessage).join(', ') +
                        (_missingIcons.length > maxIconsInMessage ? " (+ " + (_missingIcons.length - maxIconsInMessage) + " more)" : ''));
                    _missingIconsTimer = undefined;
                    _missingIcons = [];
                }, warningDelay);
            }
        }
    }
});
//# sourceMappingURL=icons.js.map