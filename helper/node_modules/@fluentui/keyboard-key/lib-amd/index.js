define(["require", "exports", "./codes"], function (require, exports, codes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TabKey = exports.PageUpKey = exports.PageDownKey = exports.HomeKey = exports.EnterKey = exports.EndKey = exports.ArrowUpKey = exports.ArrowRightKey = exports.ArrowLeftKey = exports.ArrowDownKey = exports.RightSquareBracketKey = exports.LeftSquareBracketKey = exports.RightAngleBracketKey = exports.LeftAngleBracketKey = exports.RightParenthesisKey = exports.LeftParenthesisKey = exports.RightCurlyBraceKey = exports.LeftCurlyBraceKey = exports.DoubleQuoteKey = exports.SingleQuoteKey = exports.QuestionMarkKey = exports.BackSlashKey = exports.PipeKey = exports.SemicolonKey = exports.ColonKey = exports.DecimalKey = exports.CommaKey = exports.MultiplicationSignKey = exports.DivisionSignKey = exports.EqualsSignKey = exports.MinusSignKey = exports.PlusSignKey = exports.AmpersandKey = exports.CaretKey = exports.PercentSignKey = exports.PoundSignKey = exports.AtSignKey = exports.ExclamationPointKey = exports.GraveAccentKey = exports.TildeKey = exports.Digit9Key = exports.Digit8Key = exports.Digit7Key = exports.Digit6Key = exports.Digit5Key = exports.Digit4Key = exports.Digit3Key = exports.Digit2Key = exports.Digit1Key = exports.Digit0Key = exports.SpacebarKey = exports.keyboardKey = exports.getKey = exports.getCode = void 0;
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
    function getCode(eventOrKey) {
        if (isObject(eventOrKey)) {
            // eslint-disable-next-line deprecation/deprecation, @typescript-eslint/no-explicit-any
            return eventOrKey.keyCode || eventOrKey.which || exports.keyboardKey[eventOrKey.key];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return exports.keyboardKey[eventOrKey];
    }
    exports.getCode = getCode;
    /**
     * Get the key name from a keyboard event, `keyCode`, or `which` value.
     * If an object is provided, the precedence of properties is `key`, `keyCode`, `which`.
     * @param eventOrCode - A keyboard event-like object or key code. If an object, at least one of
     * `key`, `keyCode`, or `which` must be defined.
     */
    function getKey(eventOrCode) {
        var isEvent = isObject(eventOrCode);
        var event = eventOrCode;
        // handle events with a `key` already defined
        if (isEvent && event.key) {
            return event.key;
        }
        // eslint-disable-next-line deprecation/deprecation
        var name = codes_1.codes[(isEvent ? event.keyCode || event.which : eventOrCode)];
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
    exports.getKey = getKey;
    /**
     * Mapping of keyboard keys with aliases and codes.
     */
    exports.keyboardKey = {};
    // Populate names on keyboardKey.
    for (var code in codes_1.codes) {
        if (codes_1.codes.hasOwnProperty(code)) {
            var value = codes_1.codes[code];
            if (typeof value === 'string') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                exports.keyboardKey[value] = Number(code);
            }
            else {
                // Array of valid values which map to the same code.
                for (var i = 0; i < value.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    exports.keyboardKey[value[i]] = Number(code);
                }
            }
        }
    }
    // As single exports for keys that normally have special functionality attached to them.
    exports.SpacebarKey = exports.keyboardKey[' '];
    exports.Digit0Key = exports.keyboardKey['0'];
    exports.Digit1Key = exports.keyboardKey['1'];
    exports.Digit2Key = exports.keyboardKey['2'];
    exports.Digit3Key = exports.keyboardKey['3'];
    exports.Digit4Key = exports.keyboardKey['4'];
    exports.Digit5Key = exports.keyboardKey['5'];
    exports.Digit6Key = exports.keyboardKey['6'];
    exports.Digit7Key = exports.keyboardKey['7'];
    exports.Digit8Key = exports.keyboardKey['8'];
    exports.Digit9Key = exports.keyboardKey['9'];
    exports.TildeKey = exports.keyboardKey['~'];
    exports.GraveAccentKey = exports.keyboardKey['`'];
    exports.ExclamationPointKey = exports.keyboardKey['!'];
    exports.AtSignKey = exports.keyboardKey['@'];
    exports.PoundSignKey = exports.keyboardKey['#'];
    exports.PercentSignKey = exports.keyboardKey['%'];
    exports.CaretKey = exports.keyboardKey['^'];
    exports.AmpersandKey = exports.keyboardKey['&'];
    exports.PlusSignKey = exports.keyboardKey['+'];
    exports.MinusSignKey = exports.keyboardKey['-'];
    exports.EqualsSignKey = exports.keyboardKey['='];
    exports.DivisionSignKey = exports.keyboardKey['/'];
    exports.MultiplicationSignKey = exports.keyboardKey['*'];
    exports.CommaKey = exports.keyboardKey[','];
    exports.DecimalKey = exports.keyboardKey['.'];
    exports.ColonKey = exports.keyboardKey[':'];
    exports.SemicolonKey = exports.keyboardKey[';'];
    exports.PipeKey = exports.keyboardKey['|'];
    exports.BackSlashKey = exports.keyboardKey['\\'];
    exports.QuestionMarkKey = exports.keyboardKey['?'];
    exports.SingleQuoteKey = exports.keyboardKey["'"];
    exports.DoubleQuoteKey = exports.keyboardKey['"'];
    exports.LeftCurlyBraceKey = exports.keyboardKey['{'];
    exports.RightCurlyBraceKey = exports.keyboardKey['}'];
    exports.LeftParenthesisKey = exports.keyboardKey['('];
    exports.RightParenthesisKey = exports.keyboardKey[')'];
    exports.LeftAngleBracketKey = exports.keyboardKey['<'];
    exports.RightAngleBracketKey = exports.keyboardKey['>'];
    exports.LeftSquareBracketKey = exports.keyboardKey['['];
    exports.RightSquareBracketKey = exports.keyboardKey[']'];
    exports.ArrowDownKey = exports.keyboardKey.ArrowDown;
    exports.ArrowLeftKey = exports.keyboardKey.ArrowLeft;
    exports.ArrowRightKey = exports.keyboardKey.ArrowRight;
    exports.ArrowUpKey = exports.keyboardKey.ArrowUp;
    exports.EndKey = exports.keyboardKey.End;
    exports.EnterKey = exports.keyboardKey.Enter;
    exports.HomeKey = exports.keyboardKey.Home;
    exports.PageDownKey = exports.keyboardKey.PageDown;
    exports.PageUpKey = exports.keyboardKey.PageUp;
    exports.TabKey = exports.keyboardKey.Tab;
});
//# sourceMappingURL=index.js.map