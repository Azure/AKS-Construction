import * as React from 'react';
import { classNamesFunction, styled } from '../../../Utilities';
import { getStyles } from './TagItemSuggestion.styles';
var getClassNames = classNamesFunction();
/**
 * {@docCategory TagPicker}
 */
export var TagItemSuggestionBase = function (props) {
    var styles = props.styles, theme = props.theme, children = props.children;
    var classNames = getClassNames(styles, {
        theme: theme,
    });
    return React.createElement("div", { className: classNames.suggestionTextOverflow },
        " ",
        children,
        " ");
};
export var TagItemSuggestion = styled(TagItemSuggestionBase, getStyles, undefined, { scope: 'TagItemSuggestion' });
//# sourceMappingURL=TagItemSuggestion.js.map