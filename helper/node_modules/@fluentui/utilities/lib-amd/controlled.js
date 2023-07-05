define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isControlled = void 0;
    /**
     * Determines whether a component is controlled.
     * @param props - Component props
     * @param valueProp - Prop containing the controlled value
     * @returns true if controlled, false if uncontrolled
     */
    function isControlled(props, valueProp) {
        // React's built-in <input> considers a prop to be provided if its value is non-null/undefined.
        // Mirror that behavior here (rather than checking for just undefined).
        return props[valueProp] !== undefined && props[valueProp] !== null;
    }
    exports.isControlled = isControlled;
});
//# sourceMappingURL=controlled.js.map