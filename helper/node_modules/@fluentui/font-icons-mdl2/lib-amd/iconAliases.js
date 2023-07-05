define(["require", "exports", "@fluentui/style-utilities"], function (require, exports, style_utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerIconAliases = void 0;
    var registerIconAliases = function () {
        style_utilities_1.registerIconAlias('trash', 'delete');
        style_utilities_1.registerIconAlias('onedrive', 'onedrivelogo');
        style_utilities_1.registerIconAlias('alertsolid12', 'eventdatemissed12');
        style_utilities_1.registerIconAlias('sixpointstar', '6pointstar');
        style_utilities_1.registerIconAlias('twelvepointstar', '12pointstar');
        style_utilities_1.registerIconAlias('toggleon', 'toggleleft');
        style_utilities_1.registerIconAlias('toggleoff', 'toggleright');
    };
    exports.registerIconAliases = registerIconAliases;
    exports.default = exports.registerIconAliases;
});
//# sourceMappingURL=iconAliases.js.map