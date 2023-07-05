define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.kebabRules = void 0;
    var rules = {};
    function kebabRules(rulePairs, index) {
        var rule = rulePairs[index];
        if (rule.charAt(0) !== '-') {
            rulePairs[index] = rules[rule] = rules[rule] || rule.replace(/([A-Z])/g, '-$1').toLowerCase();
        }
    }
    exports.kebabRules = kebabRules;
});
//# sourceMappingURL=kebabRules.js.map