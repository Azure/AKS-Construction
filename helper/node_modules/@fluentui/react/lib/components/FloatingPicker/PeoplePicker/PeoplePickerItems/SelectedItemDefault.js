import { __assign } from "tslib";
import * as React from 'react';
import { css, getId } from '../../../../Utilities';
import { Persona, PersonaSize, PersonaPresence } from '../../../../Persona';
import { IconButton } from '../../../../Button';
import * as stylesImport from './PickerItemsDefault.scss';
var styles = stylesImport;
export var SelectedItemDefault = function (peoplePickerItemProps) {
    var _a, _b;
    var item = peoplePickerItemProps.item, onRemoveItem = peoplePickerItemProps.onRemoveItem, index = peoplePickerItemProps.index, selected = peoplePickerItemProps.selected, removeButtonAriaLabel = peoplePickerItemProps.removeButtonAriaLabel;
    var itemId = getId();
    var onClickIconButton = function (removeItem) {
        return function () {
            if (removeItem) {
                removeItem();
            }
        };
    };
    return (React.createElement("div", { className: css('ms-PickerPersona-container', styles.personaContainer, (_a = {}, _a['is-selected ' + styles.personaContainerIsSelected] = selected, _a), (_b = {}, _b['is-invalid ' + styles.validationError] = !item.isValid, _b)), "data-is-focusable": true, "data-is-sub-focuszone": true, "data-selection-index": index, role: 'listitem', "aria-labelledby": 'selectedItemPersona-' + itemId },
        React.createElement("div", { className: css('ms-PickerItem-content', styles.itemContent), id: 'selectedItemPersona-' + itemId },
            React.createElement(Persona, __assign({}, item, { presence: item.presence !== undefined ? item.presence : PersonaPresence.none, 
                // eslint-disable-next-line deprecation/deprecation
                size: PersonaSize.size28 }))),
        React.createElement(IconButton, { onClick: onClickIconButton(onRemoveItem), iconProps: { iconName: 'Cancel', style: { fontSize: '12px' } }, className: css('ms-PickerItem-removeButton', styles.removeButton), ariaLabel: removeButtonAriaLabel })));
};
//# sourceMappingURL=SelectedItemDefault.js.map