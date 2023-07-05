import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-ChoiceFieldGroup',
    flexContainer: 'ms-ChoiceFieldGroup-flexContainer',
};
export var getStyles = function (props) {
    var className = props.className, optionsContainIconOrImage = props.optionsContainIconOrImage, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            className,
            classNames.root,
            theme.fonts.medium,
            {
                display: 'block',
            },
        ],
        flexContainer: [
            classNames.flexContainer,
            optionsContainIconOrImage && {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            },
        ],
    };
};
//# sourceMappingURL=ChoiceGroup.styles.js.map