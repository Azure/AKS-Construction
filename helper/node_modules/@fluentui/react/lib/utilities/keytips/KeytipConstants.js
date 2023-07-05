export var KTP_PREFIX = 'ktp';
export var KTP_SEPARATOR = '-';
export var KTP_FULL_PREFIX = KTP_PREFIX + KTP_SEPARATOR;
export var DATAKTP_TARGET = 'data-ktp-target';
export var DATAKTP_EXECUTE_TARGET = 'data-ktp-execute-target';
export var DATAKTP_ARIA_TARGET = 'data-ktp-aria-target';
export var KTP_LAYER_ID = 'ktp-layer-id';
export var KTP_ARIA_SEPARATOR = ', ';
// Events
export var KeytipEvents;
(function (KeytipEvents) {
    KeytipEvents.KEYTIP_ADDED = 'keytipAdded';
    KeytipEvents.KEYTIP_REMOVED = 'keytipRemoved';
    KeytipEvents.KEYTIP_UPDATED = 'keytipUpdated';
    KeytipEvents.PERSISTED_KEYTIP_ADDED = 'persistedKeytipAdded';
    KeytipEvents.PERSISTED_KEYTIP_REMOVED = 'persistedKeytipRemoved';
    KeytipEvents.PERSISTED_KEYTIP_EXECUTE = 'persistedKeytipExecute';
    KeytipEvents.ENTER_KEYTIP_MODE = 'enterKeytipMode';
    KeytipEvents.EXIT_KEYTIP_MODE = 'exitKeytipMode';
})(KeytipEvents || (KeytipEvents = {}));
//# sourceMappingURL=KeytipConstants.js.map