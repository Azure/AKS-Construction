import { arraysEqual } from './array';
/**
 * Set up a ref resolver function given internal state managed for the ref.
 * @param local Set
 */
var createResolver = function (local) { return function (newValue) {
    for (var _i = 0, _a = local.refs; _i < _a.length; _i++) {
        var ref = _a[_i];
        if (typeof ref === 'function') {
            ref(newValue);
        }
        else if (ref) {
            // work around the immutability of the React.Ref type
            ref.current = newValue;
        }
    }
}; };
/**
 * Helper to merge refs from within class components.
 */
export var createMergedRef = function (value) {
    var local = {
        refs: [],
    };
    return function () {
        var newRefs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newRefs[_i] = arguments[_i];
        }
        if (!local.resolver || !arraysEqual(local.refs, newRefs)) {
            local.resolver = createResolver(local);
        }
        local.refs = newRefs;
        return local.resolver;
    };
};
//# sourceMappingURL=createMergedRef.js.map