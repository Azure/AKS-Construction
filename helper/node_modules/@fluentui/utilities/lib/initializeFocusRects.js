import { getWindow } from './dom/getWindow';
import { isDirectionalKeyCode } from './keyboard';
import { setFocusVisibility } from './setFocusVisibility';
/**
 * Initializes the logic which:
 *
 * 1. Subscribes keydown and mousedown events. (It will only do it once per window,
 *    so it's safe to call this method multiple times.)
 * 2. When the user presses directional keyboard keys, adds the 'ms-Fabric--isFocusVisible' classname
 *    to the document body, removes the 'ms-Fabric-isFocusHidden' classname.
 * 3. When the user clicks a mouse button, adds the 'ms-Fabric-isFocusHidden' classname to the
 *    document body, removes the 'ms-Fabric--isFocusVisible' classname.
 *
 * This logic allows components on the page to conditionally render focus treatments based on
 * the existence of global classnames, which simplifies logic overall.
 *
 * @param window - the window used to add the event listeners
 * @deprecated Use useFocusRects hook or FocusRects component instead.
 */
export function initializeFocusRects(window) {
    var _a;
    var win = (window || getWindow());
    if (!win || ((_a = win.FabricConfig) === null || _a === void 0 ? void 0 : _a.disableFocusRects) === true) {
        return;
    }
    if (!win.__hasInitializeFocusRects__) {
        win.__hasInitializeFocusRects__ = true;
        win.addEventListener('mousedown', _onMouseDown, true);
        win.addEventListener('pointerdown', _onPointerDown, true);
        win.addEventListener('keydown', _onKeyDown, true);
    }
}
function _onMouseDown(ev) {
    setFocusVisibility(false, ev.target);
}
function _onPointerDown(ev) {
    if (ev.pointerType !== 'mouse') {
        setFocusVisibility(false, ev.target);
    }
}
function _onKeyDown(ev) {
    // eslint-disable-next-line deprecation/deprecation
    isDirectionalKeyCode(ev.which) && setFocusVisibility(true, ev.target);
}
//# sourceMappingURL=initializeFocusRects.js.map