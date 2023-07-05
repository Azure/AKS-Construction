import { getGlobalClassNames, getInputFocusStyle } from '../../Styling';
import { IsFocusVisibleClassName } from '../../Utilities';
import { DocumentCardPreviewGlobalClassNames as previewClassNames } from './DocumentCardPreview.styles';
import { DocumentCardActivityGlobalClassNames as activityClassNames } from './DocumentCardActivity.styles';
import { DocumentCardTitleGlobalClassNames as titleClassNames } from './DocumentCardTitle.styles';
import { DocumentCardLocationGlobalClassNames as locationClassNames } from './DocumentCardLocation.styles';
var GlobalClassNames = {
    root: 'ms-DocumentCard',
    rootActionable: 'ms-DocumentCard--actionable',
    rootCompact: 'ms-DocumentCard--compact',
};
export var getStyles = function (props) {
    var _a, _b;
    var className = props.className, theme = props.theme, actionable = props.actionable, compact = props.compact;
    var palette = theme.palette, fonts = theme.fonts, effects = theme.effects;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                WebkitFontSmoothing: 'antialiased',
                backgroundColor: palette.white,
                border: "1px solid " + palette.neutralLight,
                maxWidth: '320px',
                minWidth: '206px',
                userSelect: 'none',
                position: 'relative',
                selectors: (_a = {
                        ':focus': {
                            outline: '0px solid',
                        }
                    },
                    _a["." + IsFocusVisibleClassName + " &:focus"] = getInputFocusStyle(palette.neutralSecondary, effects.roundedCorner2),
                    _a["." + locationClassNames.root + " + ." + titleClassNames.root] = {
                        paddingTop: '4px',
                    },
                    _a),
            },
            actionable && [
                classNames.rootActionable,
                {
                    selectors: {
                        ':hover': {
                            cursor: 'pointer',
                            borderColor: palette.neutralTertiaryAlt,
                        },
                        ':hover:after': {
                            content: '" "',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            border: "1px solid " + palette.neutralTertiaryAlt,
                            pointerEvents: 'none',
                        },
                    },
                },
            ],
            compact && [
                classNames.rootCompact,
                {
                    display: 'flex',
                    maxWidth: '480px',
                    height: '108px',
                    selectors: (_b = {},
                        _b["." + previewClassNames.root] = {
                            borderRight: "1px solid " + palette.neutralLight,
                            borderBottom: 0,
                            maxHeight: '106px',
                            maxWidth: '144px',
                        },
                        _b["." + previewClassNames.icon] = {
                            maxHeight: '32px',
                            maxWidth: '32px',
                        },
                        _b["." + activityClassNames.root] = {
                            paddingBottom: '12px',
                        },
                        _b["." + titleClassNames.root] = {
                            paddingBottom: '12px 16px 8px 16px',
                            fontSize: fonts.mediumPlus.fontSize,
                            lineHeight: '16px',
                        },
                        _b),
                },
            ],
            className,
        ],
    };
};
//# sourceMappingURL=DocumentCard.styles.js.map