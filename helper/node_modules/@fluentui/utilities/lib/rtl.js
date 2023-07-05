import { KeyCodes } from './KeyCodes';
import { getDocument } from './dom/getDocument';
import { getItem, setItem } from './sessionStorage';
import { setRTL as mergeStylesSetRTL } from '@fluentui/merge-styles';
var RTL_LOCAL_STORAGE_KEY = 'isRTL';
// Default to undefined so that we initialize on first read.
var _isRTL;
/**
 * Gets the rtl state of the page (returns true if in rtl.)
 */
export function getRTL(theme) {
    if (theme === void 0) { theme = {}; }
    if (theme.rtl !== undefined) {
        return theme.rtl;
    }
    if (_isRTL === undefined) {
        // Fabric supports persisting the RTL setting between page refreshes via session storage
        var savedRTL = getItem(RTL_LOCAL_STORAGE_KEY);
        if (savedRTL !== null) {
            _isRTL = savedRTL === '1';
            setRTL(_isRTL);
        }
        var doc = getDocument();
        if (_isRTL === undefined && doc) {
            _isRTL = ((doc.body && doc.body.getAttribute('dir')) || doc.documentElement.getAttribute('dir')) === 'rtl';
            mergeStylesSetRTL(_isRTL);
        }
    }
    return !!_isRTL;
}
/**
 * Sets the rtl state of the page (by adjusting the dir attribute of the html element.)
 */
export function setRTL(isRTL, persistSetting) {
    if (persistSetting === void 0) { persistSetting = false; }
    var doc = getDocument();
    if (doc) {
        doc.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    }
    if (persistSetting) {
        setItem(RTL_LOCAL_STORAGE_KEY, isRTL ? '1' : '0');
    }
    _isRTL = isRTL;
    mergeStylesSetRTL(_isRTL);
}
/**
 * Returns the given key, but flips right/left arrows if necessary.
 */
export function getRTLSafeKeyCode(key, theme) {
    if (theme === void 0) { theme = {}; }
    if (getRTL(theme)) {
        if (key === KeyCodes.left) {
            key = KeyCodes.right;
        }
        else if (key === KeyCodes.right) {
            key = KeyCodes.left;
        }
    }
    return key;
}
//# sourceMappingURL=rtl.js.map