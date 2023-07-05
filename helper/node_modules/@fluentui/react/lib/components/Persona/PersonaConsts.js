var _a;
import { PersonaPresence, PersonaSize } from './Persona.types';
// Persona Sizes
export var personaSize;
(function (personaSize) {
    personaSize.size8 = '20px';
    // TODO: remove in a future major release as it's deprecated.
    personaSize.size10 = '20px';
    // TODO: remove in a future major release as it's deprecated.
    personaSize.size16 = '16px';
    personaSize.size24 = '24px';
    // TODO: remove in a future major release as it's deprecated.
    personaSize.size28 = '28px';
    personaSize.size32 = '32px';
    personaSize.size40 = '40px';
    personaSize.size48 = '48px';
    personaSize.size56 = '56px';
    personaSize.size72 = '72px';
    personaSize.size100 = '100px';
    personaSize.size120 = '120px';
})(personaSize || (personaSize = {}));
// Persona Presence Sizes
export var personaPresenceSize;
(function (personaPresenceSize) {
    personaPresenceSize.size6 = '6px';
    personaPresenceSize.size8 = '8px';
    personaPresenceSize.size12 = '12px';
    personaPresenceSize.size16 = '16px';
    personaPresenceSize.size20 = '20px';
    personaPresenceSize.size28 = '28px';
    personaPresenceSize.size32 = '32px';
    /**
     * @deprecated This is now unused
     */
    personaPresenceSize.border = '2px';
})(personaPresenceSize || (personaPresenceSize = {}));
// TODO: remove the deprecated parts in a future major release.
export var sizeBoolean = function (size) { return ({
    isSize8: size === PersonaSize.size8,
    /* eslint-disable deprecation/deprecation */
    isSize10: size === PersonaSize.size10 || size === PersonaSize.tiny,
    isSize16: size === PersonaSize.size16,
    isSize24: size === PersonaSize.size24 || size === PersonaSize.extraExtraSmall,
    isSize28: size === PersonaSize.size28 || size === PersonaSize.extraSmall,
    isSize32: size === PersonaSize.size32,
    isSize40: size === PersonaSize.size40 || size === PersonaSize.small,
    isSize48: size === PersonaSize.size48 || size === PersonaSize.regular,
    isSize56: size === PersonaSize.size56,
    isSize72: size === PersonaSize.size72 || size === PersonaSize.large,
    isSize100: size === PersonaSize.size100 || size === PersonaSize.extraLarge,
    isSize120: size === PersonaSize.size120,
}); };
export var sizeToPixels = (_a = {},
    // Old deprecated sizes
    _a[PersonaSize.tiny] = 10,
    _a[PersonaSize.extraExtraSmall] = 24,
    _a[PersonaSize.extraSmall] = 28,
    _a[PersonaSize.small] = 40,
    _a[PersonaSize.regular] = 48,
    _a[PersonaSize.large] = 72,
    _a[PersonaSize.extraLarge] = 100,
    // New sizes
    _a[PersonaSize.size8] = 8,
    _a[PersonaSize.size10] = 10,
    _a[PersonaSize.size16] = 16,
    _a[PersonaSize.size24] = 24,
    _a[PersonaSize.size28] = 28,
    /* eslint-enable deprecation/deprecation */
    _a[PersonaSize.size32] = 32,
    _a[PersonaSize.size40] = 40,
    _a[PersonaSize.size48] = 48,
    _a[PersonaSize.size56] = 56,
    _a[PersonaSize.size72] = 72,
    _a[PersonaSize.size100] = 100,
    _a[PersonaSize.size120] = 120,
    _a);
export var presenceBoolean = function (presence) { return ({
    isAvailable: presence === PersonaPresence.online,
    isAway: presence === PersonaPresence.away,
    isBlocked: presence === PersonaPresence.blocked,
    isBusy: presence === PersonaPresence.busy,
    isDoNotDisturb: presence === PersonaPresence.dnd,
    isOffline: presence === PersonaPresence.offline,
}); };
//# sourceMappingURL=PersonaConsts.js.map