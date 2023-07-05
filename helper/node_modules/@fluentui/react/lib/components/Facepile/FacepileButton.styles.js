import { __assign } from "tslib";
import { concatStyleSets } from '../../Styling';
import { memoizeFunction } from '../../Utilities';
import { getStyles as getBaseButtonStyles } from '../Button/BaseButton.styles';
export var getStyles = memoizeFunction(function (theme, className, customStyles) {
    var baseButtonStyles = getBaseButtonStyles(theme);
    var customButtonStyles = concatStyleSets(baseButtonStyles, customStyles);
    return __assign(__assign({}, customButtonStyles), { root: [baseButtonStyles.root, className, theme.fonts.medium, customStyles && customStyles.root] });
});
//# sourceMappingURL=FacepileButton.styles.js.map