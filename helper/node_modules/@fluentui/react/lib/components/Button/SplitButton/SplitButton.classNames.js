import { memoizeFunction } from '../../../Utilities';
import { mergeStyles } from '../../../Styling';
export var getSplitButtonClassNames = memoizeFunction(function (styles, disabled, expanded, checked, primaryDisabled) {
    return {
        root: mergeStyles(styles.splitButtonMenuButton, expanded && [styles.splitButtonMenuButtonExpanded], disabled && [styles.splitButtonMenuButtonDisabled], checked && !disabled && [styles.splitButtonMenuButtonChecked], primaryDisabled &&
            !disabled && [
            {
                selectors: {
                    ':focus': styles.splitButtonMenuFocused,
                },
            },
        ]),
        splitButtonContainer: mergeStyles(styles.splitButtonContainer, !disabled &&
            checked && [
            styles.splitButtonContainerChecked,
            {
                selectors: {
                    ':hover': styles.splitButtonContainerCheckedHovered,
                },
            },
        ], !disabled &&
            !checked && [
            {
                selectors: {
                    ':hover': styles.splitButtonContainerHovered,
                    ':focus': styles.splitButtonContainerFocused,
                },
            },
        ], disabled && styles.splitButtonContainerDisabled),
        icon: mergeStyles(styles.splitButtonMenuIcon, disabled && styles.splitButtonMenuIconDisabled, !disabled && primaryDisabled && styles.splitButtonMenuIcon),
        flexContainer: mergeStyles(styles.splitButtonFlexContainer),
        divider: mergeStyles(styles.splitButtonDivider, (primaryDisabled || disabled) && styles.splitButtonDividerDisabled),
    };
});
//# sourceMappingURL=SplitButton.classNames.js.map