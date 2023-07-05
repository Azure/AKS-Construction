import { codes } from './codes';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var isObject = function (val) {
    return val !== null && !Array.isArray(val) && typeof val === 'object';
};
/**
 * Get the `keyCode` or `which` value from a keyboard event or `key` name.
 * If an object is provided, the precedence of properties is `keyCode`, `which`, `key`.
 * @param eventOrKey - A keyboard event-like object or `key` name. If an object, at least one of
 * `key`, `keyCode`, or `which` must be defined.
 */
export function getCode(eventOrKey) {
    if (isObject(eventOrKey)) {
        // eslint-disable-next-line deprecation/deprecation, @typescript-eslint/no-explicit-any
        return eventOrKey.keyCode || eventOrKey.which || keyboardKey[eventOrKey.key];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return keyboardKey[eventOrKey];
}
/**
 * Get the key name from a keyboard event, `keyCode`, or `which` value.
 * If an object is provided, the precedence of properties is `key`, `keyCode`, `which`.
 * @param eventOrCode - A keyboard event-like object or key code. If an object, at least one of
 * `key`, `keyCode`, or `which` must be defined.
 */
export function getKey(eventOrCode) {
    var isEvent = isObject(eventOrCode);
    var event = eventOrCode;
    // handle events with a `key` already defined
    if (isEvent && event.key) {
        return event.key;
    }
    // eslint-disable-next-line deprecation/deprecation
    var name = codes[(isEvent ? event.keyCode || event.which : eventOrCode)];
    if (Array.isArray(name)) {
        if (isEvent) {
            name = name[event.shiftKey ? 1 : 0];
        }
        else {
            name = name[0];
        }
    }
    return name;
}
/**
 * Mapping of keyboard keys with aliases and codes.
 */
export var keyboardKey = {};
// Populate names on keyboardKey.
for (var code in codes) {
    if (codes.hasOwnProperty(code)) {
        var value = codes[code];
        if (typeof value === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyboardKey[value] = Number(code);
        }
        else {
            // Array of valid values which map to the same code.
            for (var i = 0; i < value.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                keyboardKey[value[i]] = Number(code);
            }
        }
    }
}
// As single exports for keys that normally have special functionality attached to them.
export var SpacebarKey = keyboardKey[' '];
export var Digit0Key = keyboardKey['0'];
export var Digit1Key = keyboardKey['1'];
export var Digit2Key = keyboardKey['2'];
export var Digit3Key = keyboardKey['3'];
export var Digit4Key = keyboardKey['4'];
export var Digit5Key = keyboardKey['5'];
export var Digit6Key = keyboardKey['6'];
export var Digit7Key = keyboardKey['7'];
export var Digit8Key = keyboardKey['8'];
export var Digit9Key = keyboardKey['9'];
export var TildeKey = keyboardKey['~'];
export var GraveAccentKey = keyboardKey['`'];
export var ExclamationPointKey = keyboardKey['!'];
export var AtSignKey = keyboardKey['@'];
export var PoundSignKey = keyboardKey['#'];
export var PercentSignKey = keyboardKey['%'];
export var CaretKey = keyboardKey['^'];
export var AmpersandKey = keyboardKey['&'];
export var PlusSignKey = keyboardKey['+'];
export var MinusSignKey = keyboardKey['-'];
export var EqualsSignKey = keyboardKey['='];
export var DivisionSignKey = keyboardKey['/'];
export var MultiplicationSignKey = keyboardKey['*'];
export var CommaKey = keyboardKey[','];
export var DecimalKey = keyboardKey['.'];
export var ColonKey = keyboardKey[':'];
export var SemicolonKey = keyboardKey[';'];
export var PipeKey = keyboardKey['|'];
export var BackSlashKey = keyboardKey['\\'];
export var QuestionMarkKey = keyboardKey['?'];
export var SingleQuoteKey = keyboardKey["'"];
export var DoubleQuoteKey = keyboardKey['"'];
export var LeftCurlyBraceKey = keyboardKey['{'];
export var RightCurlyBraceKey = keyboardKey['}'];
export var LeftParenthesisKey = keyboardKey['('];
export var RightParenthesisKey = keyboardKey[')'];
export var LeftAngleBracketKey = keyboardKey['<'];
export var RightAngleBracketKey = keyboardKey['>'];
export var LeftSquareBracketKey = keyboardKey['['];
export var RightSquareBracketKey = keyboardKey[']'];
export var ArrowDownKey = keyboardKey.ArrowDown;
export var ArrowLeftKey = keyboardKey.ArrowLeft;
export var ArrowRightKey = keyboardKey.ArrowRight;
export var ArrowUpKey = keyboardKey.ArrowUp;
export var EndKey = keyboardKey.End;
export var EnterKey = keyboardKey.Enter;
export var HomeKey = keyboardKey.Home;
export var PageDownKey = keyboardKey.PageDown;
export var PageUpKey = keyboardKey.PageUp;
export var TabKey = keyboardKey.Tab;
//# sourceMappingURL=index.js.map