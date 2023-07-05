/**
 * Gets the language set for the page.
 * @param persistenceType - Where to persist the value. Default is `sessionStorage` if available.
 */
export declare function getLanguage(persistenceType?: 'localStorage' | 'sessionStorage' | 'none'): string | null;
/**
 * Sets the language for the page (by adjusting the lang attribute of the html element).
 * @param language - Language to set.
 * @param persistenceType - Where to persist the value. Default is `sessionStorage` if available.
 */
export declare function setLanguage(language: string, persistenceType?: 'localStorage' | 'sessionStorage' | 'none'): void;
/**
 * Sets the language for the page (by adjusting the lang attribute of the html element).
 * @deprecated Use string parameter version.
 * @param language - Language to set.
 * @param avoidPersisting - If true, don't store the value.
 */
export declare function setLanguage(language: string, avoidPersisting?: boolean): void;
