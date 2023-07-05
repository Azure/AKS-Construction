"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconClassName = void 0;
var merge_styles_1 = require("@fluentui/merge-styles");
var icons_1 = require("./icons");
var defaultIconStyles = {
    display: 'inline-block',
};
/**
 * Gets an icon classname. You should be able to add this classname to an I tag with no
 * additional classnames, and render the icon.
 *
 * @public
 */
function getIconClassName(name) {
    var className = '';
    var icon = icons_1.getIcon(name);
    if (icon) {
        className = merge_styles_1.mergeStyles(icon.subset.className, defaultIconStyles, {
            selectors: {
                '::before': {
                    content: "\"" + icon.code + "\"",
                },
            },
        });
    }
    return className;
}
exports.getIconClassName = getIconClassName;
//# sourceMappingURL=getIconClassName.js.map