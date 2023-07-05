import { styled } from '../../Utilities';
import { PersonaBase } from './Persona.base';
import { getStyles } from './Persona.styles';
/**
 * Personas are used for rendering an individual's avatar, presence and details.
 * They are used within the PeoplePicker components.
 */
export var Persona = styled(PersonaBase, getStyles, undefined, {
    scope: 'Persona',
});
//# sourceMappingURL=Persona.js.map