import { __assign, __extends } from "tslib";
import * as React from 'react';
import { IconButton } from '../../../../Button';
import { css, getId, initializeComponentRef } from '../../../../Utilities';
import { Persona, PersonaSize } from '../../../../Persona';
import * as stylesImport from './ExtendedSelectedItem.scss';
var styles = stylesImport;
var ExtendedSelectedItem = /** @class */ (function (_super) {
    __extends(ExtendedSelectedItem, _super);
    function ExtendedSelectedItem(props) {
        var _this = _super.call(this, props) || this;
        _this.persona = React.createRef();
        initializeComponentRef(_this);
        // eslint-disable-next-line react/no-unused-state
        _this.state = { contextualMenuVisible: false };
        return _this;
    }
    ExtendedSelectedItem.prototype.render = function () {
        var _a, _b;
        var _c = this.props, item = _c.item, onExpandItem = _c.onExpandItem, onRemoveItem = _c.onRemoveItem, removeButtonAriaLabel = _c.removeButtonAriaLabel, index = _c.index, selected = _c.selected;
        var itemId = getId();
        return (React.createElement("div", { ref: this.persona, className: css('ms-PickerPersona-container', styles.personaContainer, (_a = {}, _a['is-selected ' + styles.personaContainerIsSelected] = selected, _a), (_b = {}, _b['is-invalid ' + styles.validationError] = !item.isValid, _b)), "data-is-focusable": true, "data-is-sub-focuszone": true, "data-selection-index": index, role: 'listitem', "aria-labelledby": 'selectedItemPersona-' + itemId },
            React.createElement("div", { hidden: !item.canExpand || onExpandItem === undefined },
                React.createElement(IconButton, { onClick: this._onClickIconButton(onExpandItem), iconProps: { iconName: 'Add', style: { fontSize: '14px' } }, className: css('ms-PickerItem-removeButton', styles.expandButton, styles.actionButton), ariaLabel: removeButtonAriaLabel })),
            React.createElement("div", { className: css(styles.personaWrapper) },
                React.createElement("div", { className: css('ms-PickerItem-content', styles.itemContent), id: 'selectedItemPersona-' + itemId },
                    React.createElement(Persona, __assign({}, item, { onRenderCoin: this.props.renderPersonaCoin, onRenderPrimaryText: this.props.renderPrimaryText, size: PersonaSize.size32 }))),
                React.createElement(IconButton, { onClick: this._onClickIconButton(onRemoveItem), iconProps: { iconName: 'Cancel', style: { fontSize: '14px' } }, className: css('ms-PickerItem-removeButton', styles.removeButton, styles.actionButton), ariaLabel: removeButtonAriaLabel }))));
    };
    ExtendedSelectedItem.prototype._onClickIconButton = function (action) {
        return function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            if (action) {
                action();
            }
        };
    };
    return ExtendedSelectedItem;
}(React.Component));
export { ExtendedSelectedItem };
//# sourceMappingURL=ExtendedSelectedItem.js.map