define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FocusZoneDirection = exports.FocusZoneTabbableElements = void 0;
    /**
     * {@docCategory FocusZone}
     */
    exports.FocusZoneTabbableElements = {
        /** Tabbing is not allowed */
        none: 0,
        /** All tabbing action is allowed */
        all: 1,
        /** Tabbing is allowed only on input elements */
        inputOnly: 2,
    };
    /**
     * {@docCategory FocusZone}
     */
    var FocusZoneDirection;
    (function (FocusZoneDirection) {
        /** Only react to up/down arrows. */
        FocusZoneDirection[FocusZoneDirection["vertical"] = 0] = "vertical";
        /** Only react to left/right arrows. */
        FocusZoneDirection[FocusZoneDirection["horizontal"] = 1] = "horizontal";
        /** React to all arrows. */
        FocusZoneDirection[FocusZoneDirection["bidirectional"] = 2] = "bidirectional";
        /**
         * React to all arrows. Navigate next item in DOM on right/down arrow keys and previous - left/up arrow keys.
         * Right and Left arrow keys are swapped in RTL mode.
         */
        FocusZoneDirection[FocusZoneDirection["domOrder"] = 3] = "domOrder";
    })(FocusZoneDirection = exports.FocusZoneDirection || (exports.FocusZoneDirection = {}));
});
//# sourceMappingURL=FocusZone.types.js.map