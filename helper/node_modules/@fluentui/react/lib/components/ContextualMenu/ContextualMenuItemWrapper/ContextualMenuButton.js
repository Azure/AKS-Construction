import { __assign, __extends } from "tslib";
import * as React from 'react';
import { buttonProperties, getNativeProps, memoizeFunction, getId, mergeAriaAttributeValues } from '../../../Utilities';
import { ContextualMenuItemWrapper } from './ContextualMenuItemWrapper';
import { KeytipData } from '../../../KeytipData';
import { getIsChecked, isItemDisabled, hasSubmenu, getMenuItemAriaRole } from '../../../utilities/contextualMenu/index';
import { ContextualMenuItem } from '../ContextualMenuItem';
var ContextualMenuButton = /** @class */ (function (_super) {
    __extends(ContextualMenuButton, _super);
    function ContextualMenuButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn = React.createRef();
        _this._getMemoizedMenuButtonKeytipProps = memoizeFunction(function (keytipProps) {
            return __assign(__assign({}, keytipProps), { hasMenu: true });
        });
        _this._renderAriaDescription = function (ariaDescription, className) {
            // If ariaDescription is given, descriptionId will be assigned to ariaDescriptionSpan
            return ariaDescription ? (React.createElement("span", { id: _this._ariaDescriptionId, className: className }, ariaDescription)) : null;
        };
        _this._getSubmenuTarget = function () {
            return _this._btn.current ? _this._btn.current : undefined;
        };
        return _this;
    }
    ContextualMenuButton.prototype.render = function () {
        var _this = this;
        var _a = this.props, item = _a.item, classNames = _a.classNames, index = _a.index, focusableElementIndex = _a.focusableElementIndex, totalItemCount = _a.totalItemCount, hasCheckmarks = _a.hasCheckmarks, hasIcons = _a.hasIcons, _b = _a.contextualMenuItemAs, ChildrenRenderer = _b === void 0 ? ContextualMenuItem : _b, expandedMenuItemKey = _a.expandedMenuItemKey, onItemMouseDown = _a.onItemMouseDown, onItemClick = _a.onItemClick, openSubMenu = _a.openSubMenu, dismissSubMenu = _a.dismissSubMenu, dismissMenu = _a.dismissMenu;
        var isChecked = getIsChecked(item);
        var canCheck = isChecked !== null;
        var defaultRole = getMenuItemAriaRole(item);
        var itemHasSubmenu = hasSubmenu(item);
        var itemProps = item.itemProps, ariaLabel = item.ariaLabel, ariaDescription = item.ariaDescription;
        var buttonNativeProperties = getNativeProps(item, buttonProperties);
        // Do not add the disabled attribute to the button so that it is focusable
        delete buttonNativeProperties.disabled;
        var itemRole = item.role || defaultRole;
        // Check for ariaDescription to set the _ariaDescriptionId and render a hidden span with
        // the description in it to be added to ariaDescribedBy
        if (ariaDescription) {
            this._ariaDescriptionId = getId();
        }
        var ariaDescribedByIds = mergeAriaAttributeValues(item.ariaDescribedBy, ariaDescription ? this._ariaDescriptionId : undefined, buttonNativeProperties['aria-describedby']);
        var itemButtonProperties = {
            className: classNames.root,
            onClick: this._onItemClick,
            onKeyDown: itemHasSubmenu ? this._onItemKeyDown : undefined,
            onMouseEnter: this._onItemMouseEnter,
            onMouseLeave: this._onItemMouseLeave,
            onMouseDown: function (ev) {
                return onItemMouseDown ? onItemMouseDown(item, ev) : undefined;
            },
            onMouseMove: this._onItemMouseMove,
            href: item.href,
            title: item.title,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedByIds,
            'aria-haspopup': itemHasSubmenu || undefined,
            'aria-expanded': itemHasSubmenu ? item.key === expandedMenuItemKey : undefined,
            'aria-posinset': focusableElementIndex + 1,
            'aria-setsize': totalItemCount,
            'aria-disabled': isItemDisabled(item),
            'aria-checked': (itemRole === 'menuitemcheckbox' || itemRole === 'menuitemradio') && canCheck ? !!isChecked : undefined,
            'aria-selected': itemRole === 'menuitem' && canCheck ? !!isChecked : undefined,
            role: itemRole,
            // eslint-disable-next-line deprecation/deprecation
            style: item.style,
        };
        var keytipProps = item.keytipProps;
        if (keytipProps && itemHasSubmenu) {
            keytipProps = this._getMemoizedMenuButtonKeytipProps(keytipProps);
        }
        return (React.createElement(KeytipData, { keytipProps: keytipProps, ariaDescribedBy: ariaDescribedByIds, disabled: isItemDisabled(item) }, function (keytipAttributes) { return (React.createElement("button", __assign({ ref: _this._btn }, buttonNativeProperties, itemButtonProperties, keytipAttributes),
            React.createElement(ChildrenRenderer, __assign({ componentRef: item.componentRef, item: item, classNames: classNames, index: index, onCheckmarkClick: hasCheckmarks && onItemClick ? onItemClick : undefined, hasIcons: hasIcons, openSubMenu: openSubMenu, dismissSubMenu: dismissSubMenu, dismissMenu: dismissMenu, getSubmenuTarget: _this._getSubmenuTarget }, itemProps)),
            _this._renderAriaDescription(ariaDescription, classNames.screenReaderText))); }));
    };
    return ContextualMenuButton;
}(ContextualMenuItemWrapper));
export { ContextualMenuButton };
//# sourceMappingURL=ContextualMenuButton.js.map