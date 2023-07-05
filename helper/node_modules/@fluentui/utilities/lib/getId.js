import { getWindow } from './dom/getWindow';
import { Stylesheet } from '@fluentui/merge-styles';
// Initialize global window id.
var CURRENT_ID_PROPERTY = '__currentId__';
var DEFAULT_ID_STRING = 'id__';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var _global = getWindow() || {};
if (_global[CURRENT_ID_PROPERTY] === undefined) {
    _global[CURRENT_ID_PROPERTY] = 0;
}
var _initializedStylesheetResets = false;
/**
 * Generates a unique id in the global scope (this spans across duplicate copies of the same library.)
 *
 * @public
 */
export function getId(prefix) {
    if (!_initializedStylesheetResets) {
        // Configure ids to reset on stylesheet resets.
        var stylesheet = Stylesheet.getInstance();
        if (stylesheet && stylesheet.onReset) {
            stylesheet.onReset(resetIds);
        }
        _initializedStylesheetResets = true;
    }
    var index = _global[CURRENT_ID_PROPERTY]++;
    return (prefix === undefined ? DEFAULT_ID_STRING : prefix) + index;
}
/**
 * Resets id counter to an (optional) number.
 *
 * @public
 */
export function resetIds(counter) {
    if (counter === void 0) { counter = 0; }
    _global[CURRENT_ID_PROPERTY] = counter;
}
//# sourceMappingURL=getId.js.map