import * as React from 'react';
import { DATAKTP_TARGET, DATAKTP_EXECUTE_TARGET, DATAKTP_ARIA_TARGET } from '../../utilities/keytips/index';
import { useKeytipData } from './useKeytipData';
/**
 * Hook that creates a ref which is used for passing to Keytip target element.
 * The ref will handle setting the attributes needed for Keytip to work.
 */
export function useKeytipRef(options) {
    var _a = useKeytipData(options), keytipId = _a.keytipId, ariaDescribedBy = _a.ariaDescribedBy;
    var contentRef = React.useCallback(function (contentElement) {
        if (!contentElement) {
            return;
        }
        var targetElement = findFirstElement(contentElement, DATAKTP_TARGET) || contentElement;
        var executeElement = findFirstElement(contentElement, DATAKTP_EXECUTE_TARGET) || targetElement;
        var ariaElement = findFirstElement(contentElement, DATAKTP_ARIA_TARGET) || executeElement;
        setAttribute(targetElement, DATAKTP_TARGET, keytipId);
        setAttribute(executeElement, DATAKTP_EXECUTE_TARGET, keytipId);
        setAttribute(ariaElement, 'aria-describedby', ariaDescribedBy, true);
    }, [keytipId, ariaDescribedBy]);
    return contentRef;
}
export function setAttribute(element, attributeName, attributeValue, append) {
    if (append === void 0) { append = false; }
    if (element && attributeValue) {
        var value = attributeValue;
        if (append) {
            var currentValue = element.getAttribute(attributeName);
            if (currentValue && currentValue.indexOf(attributeValue) === -1) {
                value = currentValue + " " + attributeValue;
            }
        }
        element.setAttribute(attributeName, value);
    }
}
function findFirstElement(rootElement, dataAttribute) {
    return rootElement.querySelector("[" + dataAttribute + "]");
}
//# sourceMappingURL=useKeytipRef.js.map