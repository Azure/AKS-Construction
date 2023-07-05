import { __assign, __extends } from "tslib";
import * as React from 'react';
import { anchorProperties, getNativeProps, memoizeFunction, getId, mergeAriaAttributeValues } from '../../../Utilities';
import { ContextualMenuItemWrapper } from './ContextualMenuItemWrapper';
import { KeytipData } from '../../../KeytipData';
import { isItemDisabled, hasSubmenu } from '../../../utilities/contextualMenu/index';
import { ContextualMenuItem } from '../ContextualMenuItem';
var ContextualMenuAnchor = /** @class */ (function (_super) {
    __extends(ContextualMenuAnchor, _super);
    function ContextualMenuAnchor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._anchor = React.createRef();
        _this._getMemoizedMenuButtonKeytipProps = memoizeFunction(function (keytipProps) {
            return __assign(__assign({}, keytipProps), { hasMenu: true });
        });
        _this._getSubmenuTarget = function () {
            return _this._anchor.current ? _this._anchor.current : undefined;
        };
        _this._onItemClick = function (ev) {
            var _a = _this.props, item = _a.item, onItemClick = _a.onItemClick;
            if (onItemClick) {
                onItemClick(item, ev);
            }
        };
        _this._renderAriaDescription = function (ariaDescription, className) {
            // If ariaDescription is given, descriptionId will be assigned to ariaDescriptionSpan
            return ariaDescription ? (React.createElement("span", { id: _this._ariaDescriptionId, className: className }, ariaDescription)) : null;
        };
        return _this;
    }
    ContextualMenuAnchor.prototype.render = function () {
        var _this = this;
        var _a = this.props, item = _a.item, classNames = _a.classNames, index = _a.index, focusableElementIndex = _a.focusableElementIndex, totalItemCount = _a.totalItemCount, hasCheckmarks = _a.hasCheckmarks, hasIcons = _a.hasIcons, _b = _a.contextualMenuItemAs, ChildrenRenderer = _b === void 0 ? ContextualMenuItem : _b, expandedMenuItemKey = _a.expandedMenuItemKey, onItemClick = _a.onItemClick, openSubMenu = _a.openSubMenu, dismissSubMenu = _a.dismissSubMenu, dismissMenu = _a.dismissMenu;
        var anchorRel = item.rel;
        if (item.target && item.target.toLowerCase() === '_blank') {
            anchorRel = anchorRel ? anchorRel : 'nofollow noopener noreferrer'; // Safe default to prevent tabjacking
        }
        var itemHasSubmenu = hasSubmenu(item);
        var nativeProps = getNativeProps(item, anchorProperties);
        var disabled = isItemDisabled(item);
        var itemProps = item.itemProps, ariaDescription = item.ariaDescription;
        var keytipProps = item.keytipProps;
        if (keytipProps && itemHasSubmenu) {
            keytipProps = this._getMemoizedMenuButtonKeytipProps(keytipProps);
        }
        // Check for ariaDescription to set the _ariaDescriptionId and render a hidden span with
        // the description in it to be added to ariaDescribedBy
        if (ariaDescription) {
            this._ariaDescriptionId = getId();
        }
        var ariaDescribedByIds = mergeAriaAttributeValues(item.ariaDescribedBy, ariaDescription ? this._ariaDescriptionId : undefined, nativeProps['aria-describedby']);
        var additionalItemProperties = {
            'aria-describedby': ariaDescribedByIds,
        };
        return (React.createElement("div", null,
            React.createElement(KeytipData, { keytipProps: item.keytipProps, ariaDescribedBy: ariaDescribedByIds, disabled: disabled }, function (keytipAttributes) { return (React.createElement("a", __assign({}, additionalItemProperties, nativeProps, keytipAttributes, { ref: _this._anchor, href: item.href, target: item.target, rel: anchorRel, className: classNames.root, role: "menuitem", "aria-haspopup": itemHasSubmenu || undefined, "aria-expanded": itemHasSubmenu ? item.key === expandedMenuItemKey : undefined, "aria-posinset": focusableElementIndex + 1, "aria-setsize": totalItemCount, "aria-disabled": isItemDisabled(item), 
                // eslint-disable-next-line deprecation/deprecation
                style: item.style, onClick: _this._onItemClick, onMouseEnter: _this._onItemMouseEnter, onMouseLeave: _this._onItemMouseLeave, onMouseMove: _this._onItemMouseMove, onKeyDown: itemHasSubmenu ? _this._onItemKeyDown : undefined }),
                React.createElement(ChildrenRenderer, __assign({ componentRef: item.componentRef, item: item, classNames: classNames, index: index, onCheckmarkClick: hasCheckmarks && onItemClick ? onItemClick : undefined, hasIcons: hasIcons, openSubMenu: openSubMenu, dismissSubMenu: dismissSubMenu, dismissMenu: dismissMenu, getSubmenuTarget: _this._getSubmenuTarget }, itemProps)),
                _this._renderAriaDescription(ariaDescription, classNames.screenReaderText))); })));
    };
    return ContextualMenuAnchor;
}(ContextualMenuItemWrapper));
export { ContextualMenuAnchor };
//# sourceMappingURL=ContextualMenuAnchor.js.map