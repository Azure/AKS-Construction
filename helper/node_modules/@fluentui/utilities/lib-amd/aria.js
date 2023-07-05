define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeAriaAttributeValues = void 0;
    /**
     * ARIA helper to concatenate attributes, returning undefined if all attributes
     * are undefined. (Empty strings are not a valid ARIA attribute value.)
     *
     * @param ariaAttributes - ARIA attributes to merge
     */
    function mergeAriaAttributeValues() {
        var ariaAttributes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ariaAttributes[_i] = arguments[_i];
        }
        var mergedAttribute = ariaAttributes
            .filter(function (arg) { return arg; })
            .join(' ')
            .trim();
        return mergedAttribute === '' ? undefined : mergedAttribute;
    }
    exports.mergeAriaAttributeValues = mergeAriaAttributeValues;
});
//# sourceMappingURL=aria.js.map