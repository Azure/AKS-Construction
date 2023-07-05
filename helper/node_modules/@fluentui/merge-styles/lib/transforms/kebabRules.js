var rules = {};
export function kebabRules(rulePairs, index) {
    var rule = rulePairs[index];
    if (rule.charAt(0) !== '-') {
        rulePairs[index] = rules[rule] = rules[rule] || rule.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
}
//# sourceMappingURL=kebabRules.js.map