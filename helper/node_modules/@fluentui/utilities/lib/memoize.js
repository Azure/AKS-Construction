import { Stylesheet } from '@fluentui/merge-styles';
var _initializedStylesheetResets = false;
var _resetCounter = 0;
var _emptyObject = { empty: true };
var _dictionary = {};
var _weakMap = typeof WeakMap === 'undefined' ? null : WeakMap;
/**
 *  Test utility for providing a custom weakmap.
 *
 * @internal
 * */
export function setMemoizeWeakMap(weakMap) {
    _weakMap = weakMap;
}
/**
 * Reset memoizations.
 */
export function resetMemoizations() {
    _resetCounter++;
}
/**
 * Memoize decorator to be used on class methods. WARNING: the `this` reference
 * will be inaccessible within a memoized method, given that a cached method's `this`
 * would not be instance-specific.
 *
 * @public
 */
export function memoize(_target, _key, descriptor) {
    // We bind to "null" to prevent people from inadvertently pulling values from "this",
    // rather than passing them in as input values which can be memoized.
    var fn = memoizeFunction(descriptor.value && descriptor.value.bind(null));
    return {
        configurable: true,
        get: function () {
            return fn;
        },
    };
}
/**
 * Memoizes a function; when you pass in the same parameters multiple times, it returns a cached result.
 * Be careful when passing in objects, you need to pass in the same INSTANCE for caching to work. Otherwise
 * it will grow the cache unnecessarily. Also avoid using default values that evaluate functions; passing in
 * undefined for a value and relying on a default function will execute it the first time, but will not
 * re-evaluate subsequent times which may have been unexpected.
 *
 * By default, the cache will reset after 100 permutations, to avoid abuse cases where the function is
 * unintendedly called with unique objects. Without a reset, the cache could grow infinitely, so we safeguard
 * by resetting. To override this behavior, pass a value of 0 to the maxCacheSize parameter.
 *
 * @public
 * @param cb - The function to memoize.
 * @param maxCacheSize - Max results to cache. If the cache exceeds this value, it will reset on the next call.
 * @param ignoreNullOrUndefinedResult - Flag to decide whether to cache callback result if it is undefined/null.
 * If the flag is set to true, the callback result is recomputed every time till the callback result is
 * not undefined/null for the first time, and then the non-undefined/null version gets cached.
 * @returns A memoized version of the function.
 */
export function memoizeFunction(cb, maxCacheSize, ignoreNullOrUndefinedResult) {
    if (maxCacheSize === void 0) { maxCacheSize = 100; }
    if (ignoreNullOrUndefinedResult === void 0) { ignoreNullOrUndefinedResult = false; }
    // Avoid breaking scenarios which don't have weak map.
    if (!_weakMap) {
        return cb;
    }
    if (!_initializedStylesheetResets) {
        var stylesheet = Stylesheet.getInstance();
        if (stylesheet && stylesheet.onReset) {
            Stylesheet.getInstance().onReset(resetMemoizations);
        }
        _initializedStylesheetResets = true;
    }
    var rootNode;
    var cacheSize = 0;
    var localResetCounter = _resetCounter;
    return function memoizedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentNode = rootNode;
        if (rootNode === undefined ||
            localResetCounter !== _resetCounter ||
            (maxCacheSize > 0 && cacheSize > maxCacheSize)) {
            rootNode = _createNode();
            cacheSize = 0;
            localResetCounter = _resetCounter;
        }
        currentNode = rootNode;
        // Traverse the tree until we find the match.
        for (var i = 0; i < args.length; i++) {
            var arg = _normalizeArg(args[i]);
            if (!currentNode.map.has(arg)) {
                currentNode.map.set(arg, _createNode());
            }
            currentNode = currentNode.map.get(arg);
        }
        if (!currentNode.hasOwnProperty('value')) {
            currentNode.value = cb.apply(void 0, args);
            cacheSize++;
        }
        if (ignoreNullOrUndefinedResult && (currentNode.value === null || currentNode.value === undefined)) {
            currentNode.value = cb.apply(void 0, args);
        }
        return currentNode.value;
    };
}
/**
 * Creates a memoizer for a single-value function, backed by a WeakMap.
 * With a WeakMap, the memoized values are only kept as long as the source objects,
 * ensuring that there is no memory leak.
 *
 * This function assumes that the input values passed to the wrapped function will be
 * `function` or `object` types. To memoize functions which accept other inputs, use
 * `memoizeFunction`, which memoizes against arbitrary inputs using a lookup cache.
 *
 * @public
 */
export function createMemoizer(getValue) {
    if (!_weakMap) {
        // Without a `WeakMap` implementation, memoization is not possible.
        return getValue;
    }
    var cache = new _weakMap();
    function memoizedGetValue(input) {
        if (!input || (typeof input !== 'function' && typeof input !== 'object')) {
            // A WeakMap can only be used to test against reference values, i.e. 'function' and 'object'.
            // All other inputs cannot be memoized against in this manner.
            return getValue(input);
        }
        if (cache.has(input)) {
            return cache.get(input);
        }
        var value = getValue(input);
        cache.set(input, value);
        return value;
    }
    return memoizedGetValue;
}
function _normalizeArg(val) {
    if (!val) {
        return _emptyObject;
    }
    else if (typeof val === 'object' || typeof val === 'function') {
        return val;
    }
    else if (!_dictionary[val]) {
        _dictionary[val] = { val: val };
    }
    return _dictionary[val];
}
function _createNode() {
    return {
        map: _weakMap ? new _weakMap() : null,
    };
}
//# sourceMappingURL=memoize.js.map