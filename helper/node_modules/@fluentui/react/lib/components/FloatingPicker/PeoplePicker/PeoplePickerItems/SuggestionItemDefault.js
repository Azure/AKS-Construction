import { __assign } from "tslib";
import * as React from 'react';
import { css } from '../../../../Utilities';
import { Persona, PersonaSize, PersonaPresence } from '../../../../Persona';
import * as stylesImport from '../PeoplePicker.scss';
export var SuggestionItemNormal = function (personaProps, suggestionItemProps) {
    return (React.createElement("div", { className: css('ms-PeoplePicker-personaContent', stylesImport.peoplePickerPersonaContent) },
        React.createElement(Persona, __assign({ presence: personaProps.presence !== undefined ? personaProps.presence : PersonaPresence.none, size: PersonaSize.size40, className: css('ms-PeoplePicker-Persona', stylesImport.peoplePickerPersona), showSecondaryText: true }, personaProps))));
};
//# sourceMappingURL=SuggestionItemDefault.js.map