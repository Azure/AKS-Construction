"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyStyled = void 0;
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./createComponent"), exports);
tslib_1.__exportStar(require("./IComponent"), exports);
tslib_1.__exportStar(require("./IHTMLSlots"), exports);
tslib_1.__exportStar(require("./ISlots"), exports);
tslib_1.__exportStar(require("./slots"), exports);
tslib_1.__exportStar(require("./ThemeProvider"), exports);
tslib_1.__exportStar(require("./hooks/index"), exports);
var utilities_1 = require("@fluentui/utilities");
Object.defineProperty(exports, "legacyStyled", { enumerable: true, get: function () { return utilities_1.styled; } });
require("./version");
//# sourceMappingURL=index.js.map