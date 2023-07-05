"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var react_test_renderer_1 = require("react-test-renderer");
/**
 * Wrapping `create` from `react-test-renderer' with `act`.
 */
function create() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var component;
    react_test_renderer_1.act(function () {
        component = react_test_renderer_1.create.apply(void 0, args);
    });
    return component;
}
exports.create = create;
//# sourceMappingURL=reactTestRenderer.js.map