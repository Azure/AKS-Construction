import { Stylesheet, mergeCssSets, fontFace as mergeFontFace, keyframes as mergeKeyframes, } from '@fluentui/merge-styles';
var _seed = 0;
export var mergeStylesRenderer = {
    reset: function () {
        // If the stylesheet reset call is made, invalidate the cache keys.
        Stylesheet.getInstance().onReset(function () { return _seed++; });
    },
    getId: function () { return _seed; },
    renderStyles: function (styleSet, options) {
        return mergeCssSets((Array.isArray(styleSet) ? styleSet : [styleSet]), options);
    },
    renderFontFace: function (fontFace, options) {
        return mergeFontFace(fontFace);
    },
    renderKeyframes: function (keyframes) {
        return mergeKeyframes(keyframes);
    },
};
//# sourceMappingURL=mergeStylesRenderer.js.map