define(["require", "exports", "./dom/getDocument", "./localStorage", "./sessionStorage"], function (require, exports, getDocument_1, localStorage, sessionStorage) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setLanguage = exports.getLanguage = void 0;
    // Default to undefined so that we initialize on first read.
    var _language;
    var STORAGE_KEY = 'language';
    /**
     * Gets the language set for the page.
     * @param persistenceType - Where to persist the value. Default is `sessionStorage` if available.
     */
    function getLanguage(persistenceType) {
        if (persistenceType === void 0) { persistenceType = 'sessionStorage'; }
        if (_language === undefined) {
            var doc = getDocument_1.getDocument();
            var savedLanguage = persistenceType === 'localStorage'
                ? localStorage.getItem(STORAGE_KEY)
                : persistenceType === 'sessionStorage'
                    ? sessionStorage.getItem(STORAGE_KEY)
                    : undefined;
            if (savedLanguage) {
                _language = savedLanguage;
            }
            if (_language === undefined && doc) {
                _language = doc.documentElement.getAttribute('lang');
            }
            if (_language === undefined) {
                _language = 'en';
            }
        }
        return _language;
    }
    exports.getLanguage = getLanguage;
    function setLanguage(language, persistenceParam) {
        var doc = getDocument_1.getDocument();
        if (doc) {
            doc.documentElement.setAttribute('lang', language);
        }
        var persistenceType = persistenceParam === true ? 'none' : !persistenceParam ? 'sessionStorage' : persistenceParam;
        if (persistenceType === 'localStorage') {
            localStorage.setItem(STORAGE_KEY, language);
        }
        else if (persistenceType === 'sessionStorage') {
            sessionStorage.setItem(STORAGE_KEY, language);
        }
        _language = language;
    }
    exports.setLanguage = setLanguage;
});
//# sourceMappingURL=language.js.map