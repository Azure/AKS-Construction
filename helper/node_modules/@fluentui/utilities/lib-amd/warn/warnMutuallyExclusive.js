define(["require", "exports", "./warn"], function (require, exports, warn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.warnMutuallyExclusive = void 0;
    /**
     * Warns when two props which are mutually exclusive are both being used.
     *
     * @public
     * @param componentName - The name of the component being used.
     * @param props - The props passed into the component.
     * @param exclusiveMap - A map where the key is a parameter, and the value is the other parameter.
     */
    function warnMutuallyExclusive(componentName, props, exclusiveMap) {
        
    }
    exports.warnMutuallyExclusive = warnMutuallyExclusive;
});
//# sourceMappingURL=warnMutuallyExclusive.js.map