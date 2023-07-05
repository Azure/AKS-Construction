define(["require", "exports", "tslib", "./createComponent", "./IComponent", "./IHTMLSlots", "./ISlots", "./slots", "./ThemeProvider", "./hooks/index", "@fluentui/utilities", "./version"], function (require, exports, tslib_1, createComponent_1, IComponent_1, IHTMLSlots_1, ISlots_1, slots_1, ThemeProvider_1, index_1, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.legacyStyled = void 0;
    tslib_1.__exportStar(createComponent_1, exports);
    tslib_1.__exportStar(IComponent_1, exports);
    tslib_1.__exportStar(IHTMLSlots_1, exports);
    tslib_1.__exportStar(ISlots_1, exports);
    tslib_1.__exportStar(slots_1, exports);
    tslib_1.__exportStar(ThemeProvider_1, exports);
    tslib_1.__exportStar(index_1, exports);
    Object.defineProperty(exports, "legacyStyled", { enumerable: true, get: function () { return utilities_1.styled; } });
});
//# sourceMappingURL=index.js.map