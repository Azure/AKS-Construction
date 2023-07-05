import { getGlobalClassNames, HighContrastSelector } from '../../../../Styling';
import { SuggestionsItemGlobalClassNames as suggested } from '../../Suggestions/SuggestionsItem.styles';
var GlobalClassNames = {
    root: 'ms-PeoplePicker-personaContent',
    personaWrapper: 'ms-PeoplePicker-Persona',
};
export function getStyles(props) {
    var _a, _b, _c;
    var className = props.className, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    var textSelectorsStyles = {
        selectors: (_a = {},
            _a["." + suggested.isSuggested + " &"] = {
                selectors: (_b = {},
                    _b[HighContrastSelector] = {
                        color: 'HighlightText',
                    },
                    _b),
            },
            _a["." + classNames.root + ":hover &"] = {
                selectors: (_c = {},
                    _c[HighContrastSelector] = {
                        color: 'HighlightText',
                    },
                    _c),
            },
            _a),
    };
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                padding: '4px 12px',
            },
            className,
        ],
        personaWrapper: [
            classNames.personaWrapper,
            {
                width: 180,
            },
        ],
        subComponentStyles: {
            persona: {
                primaryText: textSelectorsStyles,
                secondaryText: textSelectorsStyles,
            },
        },
    };
}
//# sourceMappingURL=PeoplePickerItemSuggestion.styles.js.map