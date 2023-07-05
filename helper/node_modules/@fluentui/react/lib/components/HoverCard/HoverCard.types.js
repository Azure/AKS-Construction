/**
 * {@docCategory HoverCard}
 */
export var OpenCardMode;
(function (OpenCardMode) {
    /**
     * Open card by hover
     */
    OpenCardMode[OpenCardMode["hover"] = 0] = "hover";
    /**
     * Open card by hot key
     */
    OpenCardMode[OpenCardMode["hotKey"] = 1] = "hotKey";
})(OpenCardMode || (OpenCardMode = {}));
/**
 * {@docCategory HoverCard}
 */
export var HoverCardType;
(function (HoverCardType) {
    /**
     * Plain card consisting of one part responsive to the size of content.
     */
    HoverCardType["plain"] = "PlainCard";
    /**
     * File card consisting of two parts: compact and expanded. Has some default sizes if not specified.
     */
    HoverCardType["expanding"] = "ExpandingCard";
})(HoverCardType || (HoverCardType = {}));
//# sourceMappingURL=HoverCard.types.js.map