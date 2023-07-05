define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setVersion = void 0;
    // A packages cache that makes sure that we don't inject the same packageName twice in the same bundle -
    // this cache is local to the module closure inside this bundle
    var packagesCache = {};
    // Cache access to window to avoid IE11 memory leak.
    var _win = undefined;
    try {
        _win = window;
    }
    catch (e) {
        /* no-op */
    }
    function setVersion(packageName, packageVersion) {
        if (typeof _win !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var packages = (_win.__packages__ = _win.__packages__ || {});
            // We allow either the global packages or local packages caches to invalidate so testing can
            // just clear the global to set this state
            if (!packages[packageName] || !packagesCache[packageName]) {
                packagesCache[packageName] = packageVersion;
                var versions = (packages[packageName] = packages[packageName] || []);
                versions.push(packageVersion);
            }
        }
    }
    exports.setVersion = setVersion;
});
//# sourceMappingURL=setVersion.js.map