define(["require", "exports", "./properties"], function (require, exports, properties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNativeElementProps = void 0;
    var nativeElementMap = {
        label: properties_1.labelProperties,
        audio: properties_1.audioProperties,
        video: properties_1.videoProperties,
        ol: properties_1.olProperties,
        li: properties_1.liProperties,
        a: properties_1.anchorProperties,
        button: properties_1.buttonProperties,
        input: properties_1.inputProperties,
        textarea: properties_1.textAreaProperties,
        select: properties_1.selectProperties,
        option: properties_1.optionProperties,
        table: properties_1.tableProperties,
        tr: properties_1.trProperties,
        th: properties_1.thProperties,
        td: properties_1.tdProperties,
        colGroup: properties_1.colGroupProperties,
        col: properties_1.colProperties,
        form: properties_1.formProperties,
        iframe: properties_1.iframeProperties,
        img: properties_1.imgProperties,
    };
    /**
     * Given an element tagname and user props, filters the props to only allowed props for the given
     * element type.
     * @param tagName - Tag name (e.g. "div")
     * @param props - Props object
     * @param excludedPropNames - List of props to disallow
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getNativeElementProps(tagName, props, excludedPropNames) {
        var allowedPropNames = (tagName && nativeElementMap[tagName]) || properties_1.htmlElementProperties;
        return properties_1.getNativeProps(props, allowedPropNames, excludedPropNames);
    }
    exports.getNativeElementProps = getNativeElementProps;
});
//# sourceMappingURL=getNativeElementProps.js.map