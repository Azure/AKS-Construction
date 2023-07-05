define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasOverflow = exports.hasVerticalOverflow = exports.hasHorizontalOverflow = void 0;
    /**
     * Detects whether an element's content has horizontal overflow
     *
     * @public
     * @param element - Element to check for overflow
     * @returns True if element's content overflows
     */
    function hasHorizontalOverflow(element) {
        return element.clientWidth < element.scrollWidth;
    }
    exports.hasHorizontalOverflow = hasHorizontalOverflow;
    /**
     * Detects whether an element's content has vertical overflow
     *
     * @public
     * @param element - Element to check for overflow
     * @returns True if element's content overflows
     */
    function hasVerticalOverflow(element) {
        return element.clientHeight < element.scrollHeight;
    }
    exports.hasVerticalOverflow = hasVerticalOverflow;
    /**
     * Detects whether an element's content has overflow in any direction
     *
     * @public
     * @param element - Element to check for overflow
     * @returns True if element's content overflows
     */
    function hasOverflow(element) {
        return hasHorizontalOverflow(element) || hasVerticalOverflow(element);
    }
    exports.hasOverflow = hasOverflow;
});
//# sourceMappingURL=overflow.js.map