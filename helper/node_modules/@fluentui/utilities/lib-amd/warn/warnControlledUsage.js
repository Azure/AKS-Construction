define(["require", "exports", "./warn", "../controlled"], function (require, exports, warn_1, controlled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.warnControlledUsage = exports.resetControlledWarnings = void 0;
    var warningsMap;
    
    /** Reset controlled usage warnings for testing purposes. */
    function resetControlledWarnings() {
        
    }
    exports.resetControlledWarnings = resetControlledWarnings;
    /**
     * Check for and warn on the following error conditions with a form component:
     * - A value prop is provided (indicated it's being used as controlled) without a change handler,
     *    and the component is not read-only
     * - Both the value and defaultValue props are provided
     * - The component is attempting to switch between controlled and uncontrolled
     *
     * The messages mimic the warnings React gives for these error conditions on input elements.
     * The warning will only be displayed once per component ID.
     */
    function warnControlledUsage(params) {
        
    }
    exports.warnControlledUsage = warnControlledUsage;
});
//# sourceMappingURL=warnControlledUsage.js.map