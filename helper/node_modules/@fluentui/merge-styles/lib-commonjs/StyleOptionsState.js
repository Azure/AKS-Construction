"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleOptions = exports.getRTL = exports.setRTL = void 0;
/**
 * Sets the current RTL value.
 */
function setRTL(isRTL) {
    if (_rtl !== isRTL) {
        _rtl = isRTL;
    }
}
exports.setRTL = setRTL;
/**
 * Gets the current RTL value.
 */
function getRTL() {
    if (_rtl === undefined) {
        _rtl =
            typeof document !== 'undefined' &&
                !!document.documentElement &&
                document.documentElement.getAttribute('dir') === 'rtl';
    }
    return _rtl;
}
exports.getRTL = getRTL;
// This has been split into 2 lines because it was working in Fabric due to the code being transpiled to es5, so this
// was converted to var while not working in Fluent that uses babel to transpile the code to be es6-like. Splitting the
// logic into two lines, however, allows it to work in both scenarios.
var _rtl;
_rtl = getRTL();
function getStyleOptions() {
    return {
        rtl: getRTL(),
    };
}
exports.getStyleOptions = getStyleOptions;
//# sourceMappingURL=StyleOptionsState.js.map