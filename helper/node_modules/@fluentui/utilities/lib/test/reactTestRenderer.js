import { act, create as defaultCreate } from 'react-test-renderer';
/**
 * Wrapping `create` from `react-test-renderer' with `act`.
 */
export function create() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var component;
    act(function () {
        component = defaultCreate.apply(void 0, args);
    });
    return component;
}
//# sourceMappingURL=reactTestRenderer.js.map