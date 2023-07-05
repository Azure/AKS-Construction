define(["require", "exports", "tslib", "react", "@fluentui/style-utilities", "@fluentui/utilities"], function (require, exports, tslib_1, React, style_utilities_1, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ThemeProvider = void 0;
    /**
     * Theme provider is a simplified version of Customizer that activates the appropriate theme data
     * for a given scheme name.
     *
     * @param providers - Injected providers for accessing theme data and providing it via a Customizer component.
     * @deprecated This is an old ThemeProvider implementation. New code should use the ThemeProvider exported from
     * `@fluentui/react` (or `@fluentui/react/lib/Theme`) instead.
     */
    var ThemeProvider = function (props) {
        var scheme = props.scheme, theme = props.theme, rest = tslib_1.__rest(props, ["scheme", "theme"]);
        // TODO: consider merging implementation with theme-proto, which only stores a reference / scheme name to theme
        //   in context and uses quick global store accessor to trigger change by passing in theme object as child and
        //   triggering re-render. (perf benefits need verification)
        var contextTransform = function (context) {
            return style_utilities_1.getThemedContext(context, scheme, theme);
        };
        // eslint-disable-next-line react/jsx-no-bind, deprecation/deprecation
        return React.createElement(utilities_1.Customizer, tslib_1.__assign({}, rest, { contextTransform: contextTransform }));
    };
    exports.ThemeProvider = ThemeProvider;
});
//# sourceMappingURL=ThemeProvider.js.map