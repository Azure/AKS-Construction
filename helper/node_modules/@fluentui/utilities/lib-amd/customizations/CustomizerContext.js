define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomizerContext = void 0;
    exports.CustomizerContext = React.createContext({
        customizations: {
            inCustomizerContext: false,
            settings: {},
            scopedSettings: {},
        },
    });
});
//# sourceMappingURL=CustomizerContext.js.map