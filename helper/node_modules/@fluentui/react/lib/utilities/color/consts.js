export var MAX_COLOR_SATURATION = 100;
export var MAX_COLOR_HUE = 359;
export var MAX_COLOR_VALUE = 100;
export var MAX_COLOR_RGB = 255;
/** @deprecated Use MAX_COLOR_RGB (255) or MAX_COLOR_ALPHA (100) */
export var MAX_COLOR_RGBA = MAX_COLOR_RGB;
export var MAX_COLOR_ALPHA = 100;
/** Minimum length for a hexadecimal color string (not including the #) */
export var MIN_HEX_LENGTH = 3;
/** Maximum length for a hexadecimal color string (not including the #) */
export var MAX_HEX_LENGTH = 6;
/** Minimum length for a string of an RGBA color component */
export var MIN_RGBA_LENGTH = 1;
/** Maximum length for a string of an RGBA color component */
export var MAX_RGBA_LENGTH = 3;
/** Regular expression matching only valid hexadecimal chars */
export var HEX_REGEX = /^[\da-f]{0,6}$/i;
/** Regular expression matching only numbers */
export var RGBA_REGEX = /^\d{0,3}$/;
//# sourceMappingURL=consts.js.map