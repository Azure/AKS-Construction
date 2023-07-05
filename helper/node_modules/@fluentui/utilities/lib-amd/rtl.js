define(["require", "exports", "./KeyCodes", "./dom/getDocument", "./sessionStorage", "@fluentui/merge-styles"], function (require, exports, KeyCodes_1, getDocument_1, sessionStorage_1, merge_styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRTLSafeKeyCode = exports.setRTL = exports.getRTL = void 0;
    var RTL_LOCAL_STORAGE_KEY = 'isRTL';
    // Default to undefined so that we initialize on first read.
    var _isRTL;
    /**
     * Gets the rtl state of the page (returns true if in rtl.)
     */
    function getRTL(theme) {
        if (theme === void 0) { theme = {}; }
        if (theme.rtl !== undefined) {
            return theme.rtl;
        }
        if (_isRTL === undefined) {
            // Fabric supports persisting the RTL setting between page refreshes via session storage
            var savedRTL = sessionStorage_1.getItem(RTL_LOCAL_STORAGE_KEY);
            if (savedRTL !== null) {
                _isRTL = savedRTL === '1';
                setRTL(_isRTL);
            }
            var doc = getDocument_1.getDocument();
            if (_isRTL === undefined && doc) {
                _isRTL = ((doc.body && doc.body.getAttribute('dir')) || doc.documentElement.getAttribute('dir')) === 'rtl';
                merge_styles_1.setRTL(_isRTL);
            }
        }
        return !!_isRTL;
    }
    exports.getRTL = getRTL;
    /**
     * Sets the rtl state of the page (by adjusting the dir attribute of the html element.)
     */
    function setRTL(isRTL, persistSetting) {
        if (persistSetting === void 0) { persistSetting = false; }
        var doc = getDocument_1.getDocument();
        if (doc) {
            doc.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        }
        if (persistSetting) {
            sessionStorage_1.setItem(RTL_LOCAL_STORAGE_KEY, isRTL ? '1' : '0');
        }
        _isRTL = isRTL;
        merge_styles_1.setRTL(_isRTL);
    }
    exports.setRTL = setRTL;
    /**
     * Returns the given key, but flips right/left arrows if necessary.
     */
    function getRTLSafeKeyCode(key, theme) {
        if (theme === void 0) { theme = {}; }
        if (getRTL(theme)) {
            if (key === KeyCodes_1.KeyCodes.left) {
                key = KeyCodes_1.KeyCodes.right;
            }
            else if (key === KeyCodes_1.KeyCodes.right) {
                key = KeyCodes_1.KeyCodes.left;
            }
        }
        return key;
    }
    exports.getRTLSafeKeyCode = getRTLSafeKeyCode;
});
//# sourceMappingURL=rtl.js.map