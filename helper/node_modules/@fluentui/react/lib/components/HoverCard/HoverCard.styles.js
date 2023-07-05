import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    host: 'ms-HoverCard-host',
};
export function getStyles(props) {
    var className = props.className, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        host: [classNames.host, className],
    };
}
//# sourceMappingURL=HoverCard.styles.js.map