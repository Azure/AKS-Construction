define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.provideUnits = void 0;
    var NON_PIXEL_NUMBER_PROPS = [
        'column-count',
        'font-weight',
        'flex',
        'flex-grow',
        'flex-shrink',
        'fill-opacity',
        'opacity',
        'order',
        'z-index',
        'zoom',
    ];
    function provideUnits(rulePairs, index) {
        var name = rulePairs[index];
        var value = rulePairs[index + 1];
        if (typeof value === 'number') {
            var isNonPixelProp = NON_PIXEL_NUMBER_PROPS.indexOf(name) > -1;
            var isVariableOrPrefixed = name.indexOf('--') > -1;
            var unit = isNonPixelProp || isVariableOrPrefixed ? '' : 'px';
            rulePairs[index + 1] = "" + value + unit;
        }
    }
    exports.provideUnits = provideUnits;
});
//# sourceMappingURL=provideUnits.js.map