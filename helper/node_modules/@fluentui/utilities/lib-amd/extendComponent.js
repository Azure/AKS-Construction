define(["require", "exports", "./appendFunction"], function (require, exports, appendFunction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendComponent = void 0;
    /**
     * Extends a component's lifetime methods by appending new functions to the existing lifetime functions.
     */
    function extendComponent(parent, methods) {
        for (var name_1 in methods) {
            if (methods.hasOwnProperty(name_1)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parent[name_1] = appendFunction_1.appendFunction(parent, parent[name_1], methods[name_1]);
            }
        }
    }
    exports.extendComponent = extendComponent;
});
//# sourceMappingURL=extendComponent.js.map