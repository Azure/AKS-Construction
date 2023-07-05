define(["require", "exports", "./getParent"], function (require, exports, getParent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findElementRecursive = void 0;
    /**
     * Finds the first parent element where the matchFunction returns true
     * @param element - element to start searching at
     * @param matchFunction - the function that determines if the element is a match
     * @returns the matched element or null no match was found
     */
    function findElementRecursive(element, matchFunction) {
        if (!element || element === document.body) {
            return null;
        }
        return matchFunction(element) ? element : findElementRecursive(getParent_1.getParent(element), matchFunction);
    }
    exports.findElementRecursive = findElementRecursive;
});
//# sourceMappingURL=findElementRecursive.js.map