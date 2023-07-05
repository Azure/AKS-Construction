import { ZIndexes, getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-Layer',
    rootNoHost: 'ms-Layer--fixed',
    content: 'ms-Layer-content',
};
export var getStyles = function (props) {
    var className = props.className, isNotHost = props.isNotHost, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            theme.fonts.medium,
            isNotHost && [
                classNames.rootNoHost,
                {
                    position: 'fixed',
                    zIndex: ZIndexes.Layer,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    visibility: 'hidden',
                },
            ],
            className,
        ],
        content: [
            classNames.content,
            {
                visibility: 'visible',
            },
        ],
    };
};
//# sourceMappingURL=Layer.styles.js.map