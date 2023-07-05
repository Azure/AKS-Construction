define(["require", "exports", "./dom/getWindow", "./keyboard", "./setFocusVisibility"], function (require, exports, getWindow_1, keyboard_1, setFocusVisibility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initializeFocusRects = void 0;
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
    function initializeFocusRects(window) {
        var _a;
        var win = (window || getWindow_1.getWindow());
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
    exports.initializeFocusRects = initializeFocusRects;
    function _onMouseDown(ev) {
        setFocusVisibility_1.setFocusVisibility(false, ev.target);
    }
    function _onPointerDown(ev) {
        if (ev.pointerType !== 'mouse') {
            setFocusVisibility_1.setFocusVisibility(false, ev.target);
        }
    }
    function _onKeyDown(ev) {
        // eslint-disable-next-line deprecation/deprecation
        keyboard_1.isDirectionalKeyCode(ev.which) && setFocusVisibility_1.setFocusVisibility(true, ev.target);
    }
});
//# sourceMappingURL=initializeFocusRects.js.map