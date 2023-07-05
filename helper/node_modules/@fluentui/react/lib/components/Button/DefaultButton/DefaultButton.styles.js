import { concatStyleSets, FontWeights } from '../../../Styling';
import { memoizeFunction } from '../../../Utilities';
import { getStyles as getBaseButtonStyles } from '../BaseButton.styles';
import { getStyles as getSplitButtonStyles } from '../SplitButton/SplitButton.styles';
import { primaryStyles, standardStyles } from '../ButtonThemes';
var DEFAULT_BUTTON_HEIGHT = '32px';
var DEFAULT_BUTTON_MIN_WIDTH = '80px';
export var getStyles = memoizeFunction(function (theme, customStyles, primary) {
    var baseButtonStyles = getBaseButtonStyles(theme);
    var splitButtonStyles = getSplitButtonStyles(theme);
    var defaultButtonStyles = {
        root: {
            minWidth: DEFAULT_BUTTON_MIN_WIDTH,
            height: DEFAULT_BUTTON_HEIGHT,
        },
        label: {
            fontWeight: FontWeights.semibold,
        },
    };
    return concatStyleSets(baseButtonStyles, defaultButtonStyles, primary ? primaryStyles(theme) : standardStyles(theme), splitButtonStyles, customStyles);
});
//# sourceMappingURL=DefaultButton.styles.js.map