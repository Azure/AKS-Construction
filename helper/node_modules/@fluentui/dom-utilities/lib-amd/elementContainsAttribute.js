define(["require", "exports", "./findElementRecursive"], function (require, exports, findElementRecursive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.elementContainsAttribute = void 0;
    /**
     * Determines if an element, or any of its ancestors, contain the given attribute
     * @param element - element to start searching at
     * @param attribute - the attribute to search for
     * @returns the value of the first instance found
     */
    function elementContainsAttribute(element, attribute) {
        var elementMatch = findElementRecursive_1.findElementRecursive(element, function (testElement) { return testElement.hasAttribute(attribute); });
        return elementMatch && elementMatch.getAttribute(attribute);
    }
    exports.elementContainsAttribute = elementContainsAttribute;
});
//# sourceMappingURL=elementContainsAttribute.js.map