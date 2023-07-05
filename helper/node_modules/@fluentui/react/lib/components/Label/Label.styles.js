import { __assign } from "tslib";
import { HighContrastSelector, FontWeights, getHighContrastNoAdjustStyle } from '../../Styling';
export var getStyles = function (props) {
    var _a;
    var theme = props.theme, className = props.className, disabled = props.disabled, required = props.required;
    var semanticColors = theme.semanticColors;
    // Tokens
    var labelFontWeight = FontWeights.semibold;
    var labelColor = semanticColors.bodyText;
    var labelDisabledColor = semanticColors.disabledBodyText;
    var labelRequiredStarColor = semanticColors.errorText;
    return {
        root: [
            'ms-Label',
            theme.fonts.medium,
            {
                fontWeight: labelFontWeight,
                color: labelColor,
                boxSizing: 'border-box',
                boxShadow: 'none',
                margin: 0,
                display: 'block',
                padding: '5px 0',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            },
            disabled && {
                color: labelDisabledColor,
                selectors: (_a = {},
                    _a[HighContrastSelector] = __assign({ color: 'GrayText' }, getHighContrastNoAdjustStyle()),
                    _a),
            },
            required && {
                selectors: {
                    '::after': {
                        content: "' *'",
                        color: labelRequiredStarColor,
                        paddingRight: 12,
                    },
                },
            },
            className,
        ],
    };
};
//# sourceMappingURL=Label.styles.js.map