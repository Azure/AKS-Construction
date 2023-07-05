import { getColorFromString } from '../../utilities/color/getColorFromString';
import { isValidShade, getShade, getBackgroundShade } from '../../utilities/color/shades';
import { format } from '../../Utilities';
var ThemeGenerator = /** @class */ (function () {
    function ThemeGenerator() {
    }
    /**
     * Sets an IThemeSlotRule to the given color and cascades it to the rest of the theme, updating other IThemeSlotRules
     * in the theme that inherit from that color.
     * @param isInverted - whether it's a dark theme or not, which affects the algorithm used to generate shades
     * @param isCustomization - should be true only if it's a user action, and indicates overwriting the slot's
     * inheritance (if any)
     * @param overwriteCustomColor - A slot could have a generated color based on its inheritance rules (isCustomized
     * is false), or a custom color based on user input (isCustomized is true). This bool tells us whether to override
     * existing customized colors.
     */
    ThemeGenerator.setSlot = function (rule, color, isInverted, isCustomization, overwriteCustomColor) {
        if (isInverted === void 0) { isInverted = false; }
        if (isCustomization === void 0) { isCustomization = false; }
        if (overwriteCustomColor === void 0) { overwriteCustomColor = true; }
        if (!rule.color && rule.value) {
            // not a color rule
            return;
        }
        if (overwriteCustomColor) {
            var colorAsIColor = void 0;
            if (typeof color === 'string') {
                colorAsIColor = getColorFromString(color); // the ! is a lie here but we'll verify it in the next line
                if (!colorAsIColor) {
                    throw new Error('color is invalid in setSlot(): ' + color);
                }
            }
            else {
                colorAsIColor = color;
            }
            ThemeGenerator._setSlot(rule, colorAsIColor, isInverted, isCustomization, overwriteCustomColor);
        }
        else if (rule.color) {
            ThemeGenerator._setSlot(rule, rule.color, isInverted, isCustomization, overwriteCustomColor);
        }
    };
    /**
     * Sets the color of each slot based on its rule. Slots that don't inherit must have a color already.
     * If this completes without error, then the theme is ready to use. (All slots will have a color.)
     * setSlot() can be called before this, but this must be called before getThemeAs*().
     * Does not override colors of rules where isCustomized is true (i.e. doesn't override existing customizations).
     */
    ThemeGenerator.insureSlots = function (slotRules, isInverted) {
        // Get all the "root" rules, the ones which don't inherit. Then "set" them to trigger updating dependent slots.
        for (var ruleName in slotRules) {
            if (slotRules.hasOwnProperty(ruleName)) {
                var rule = slotRules[ruleName];
                if (!rule.inherits && !rule.value) {
                    if (!rule.color) {
                        throw new Error('A color slot rule that does not inherit must provide its own color.');
                    }
                    ThemeGenerator._setSlot(rule, rule.color, isInverted, false, false);
                }
            }
        }
    };
    /**
     * Gets the JSON-formatted blob that describes the theme, usable with the REST request endpoints:
     * ```
     * { [theme slot name as string] : [color as string],
     *  "tokenName": "#f00f00",
     *  "tokenName2": "#ba2ba2",
     *   ... }
     * ```
     */
    ThemeGenerator.getThemeAsJson = function (slotRules) {
        var theme = {};
        for (var ruleName in slotRules) {
            if (slotRules.hasOwnProperty(ruleName)) {
                var rule = slotRules[ruleName];
                theme[rule.name] = rule.color ? rule.color.str : rule.value || '';
            }
        }
        return theme;
    };
    /**
     * Gets code-formatted load theme blob that can be copy and pasted.
     * Only used for the old theme designer, where loadTheme usage is acceptable,
     * unlike in the new theme designer.
     */
    ThemeGenerator.getThemeAsCode = function (slotRules) {
        var output = 'loadTheme({\n  palette: {\n';
        return ThemeGenerator._makeRemainingCode(output, slotRules);
    };
    /**
     * Gets code-formatted load theme blob, specifically for the new theme designer,
     * aka.ms/themedesigner. Shouldn't use loadTheme like the old theme designer since it's deprecated.
     * We want to use the theme object from createTheme and use the Customizations.applySettings API instead.
     */
    ThemeGenerator.getThemeAsCodeWithCreateTheme = function (slotRules) {
        var output = 'const myTheme = createTheme({\n  palette: {\n';
        return ThemeGenerator._makeRemainingCode(output, slotRules);
    };
    /**
     * Gets the theme as a list of SASS variables that can be used in code
     * ```
     * $tokenName: "[theme:tokenName, default:#f00f00]";
     * $tokenName2: "[theme:tokenName2, default:#ba2ba2]";
     * ...
     * ```
     */
    ThemeGenerator.getThemeAsSass = function (slotRules) {
        var sassVarTemplate = '${0}Color: "[theme: {1}, default: {2}]";\n';
        var output = '';
        for (var ruleName in slotRules) {
            if (slotRules.hasOwnProperty(ruleName)) {
                var rule = slotRules[ruleName];
                var camelCasedName = rule.name.charAt(0).toLowerCase() + rule.name.slice(1);
                output += format(sassVarTemplate, camelCasedName, camelCasedName, rule.color ? rule.color.str : rule.value || '');
            }
        }
        return output;
    };
    /**
     * Gets the theme formatted for PowerShell scripts
     * ```
     * @{
     * "tokenName" = "#f00f00";
     * "tokenName2" = "#ba2ba2";
     * ...
     * }
     * ```
     */
    ThemeGenerator.getThemeForPowerShell = function (slotRules) {
        var psVarTemplate = '"{0}" = "{1}";\n';
        var output = '';
        for (var ruleName in slotRules) {
            if (slotRules.hasOwnProperty(ruleName)) {
                var rule = slotRules[ruleName];
                if (rule.value) {
                    // skip this one, it's not a color
                    continue;
                }
                var camelCasedName = rule.name.charAt(0).toLowerCase() + rule.name.slice(1);
                var outputColor = rule.color ? '#' + rule.color.hex : rule.value || '';
                // powershell endpoint uses the RGBA format
                if (rule.color && rule.color.a && rule.color.a !== 100) {
                    outputColor += String(rule.color.a.toString(16));
                }
                output += format(psVarTemplate, camelCasedName, outputColor);
            }
        }
        return '@{\n' + output + '}';
    };
    /**
     * Sets the given slot's color to the appropriate color, shading it if necessary.
     * Then, iterates through all other rules (that are this rule's dependents) to update them accordingly.
     * @param isCustomization - If true, it's a user-provided color, which should be to that raw color.
     * If false, the rule it's inheriting from changed, so updated using asShade.
     */
    ThemeGenerator._setSlot = function (rule, color, isInverted, isCustomization, overwriteCustomColor) {
        if (overwriteCustomColor === void 0) { overwriteCustomColor = true; }
        if (!rule.color && rule.value) {
            // not a color rule
            return;
        }
        if (overwriteCustomColor || !rule.color || !rule.isCustomized || !rule.inherits) {
            // set the rule's color under these conditions
            if ((overwriteCustomColor || !rule.isCustomized) &&
                !isCustomization &&
                rule.inherits &&
                isValidShade(rule.asShade)) {
                // it's inheriting by shade
                if (rule.isBackgroundShade) {
                    rule.color = getBackgroundShade(color, rule.asShade, isInverted);
                }
                else {
                    rule.color = getShade(color, rule.asShade, isInverted);
                }
                rule.isCustomized = false;
            }
            else {
                rule.color = color;
                rule.isCustomized = true;
            }
            // then update dependent colors
            for (var _i = 0, _a = rule.dependentRules; _i < _a.length; _i++) {
                var ruleToUpdate = _a[_i];
                ThemeGenerator._setSlot(ruleToUpdate, rule.color, isInverted, false, overwriteCustomColor);
            }
        }
    };
    /**
     * Makes the rest of the code that's used for the load theme blob in the exported codepens of
     * both the older sharepoint-specific theme designer and the new theme designer. Takes in
     * theme rules and converts them to format fitting a list of palette colors and their values.
     * Resulting output looks like:
     * ```
     * const _theme = createTheme({
     *  palette: {
     *    themePrimary: '#0078d4',
     *    themeLighterAlt: '#f3f9fd',
     *    ...
     *  }});
     * ```
     * The first line is loadTheme instead of createTheme for the old sharepoint theme designer.
     */
    ThemeGenerator._makeRemainingCode = function (output, slotRules) {
        var attributeTemplate = "    {0}: '{1}',\n";
        for (var ruleName in slotRules) {
            if (slotRules.hasOwnProperty(ruleName)) {
                var rule = slotRules[ruleName];
                var camelCasedName = rule.name.charAt(0).toLowerCase() + rule.name.slice(1);
                var outputColor = rule.color ? '#' + rule.color.hex : rule.value || '';
                output += format(attributeTemplate, camelCasedName, outputColor);
            }
        }
        output += '  }});';
        return output;
    };
    return ThemeGenerator;
}());
export { ThemeGenerator };
//# sourceMappingURL=ThemeGenerator.js.map