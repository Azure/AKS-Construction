import { find } from '../../Utilities';
/**
 * Tests for equality between two IKeytipTransitionKeys.
 *
 * @param key1 - First IKeytipTransitionKey.
 * @param key2 - Second IKeytipTransitionKey.
 * @returns T/F if the transition keys are equal.
 */
export function transitionKeysAreEqual(key1, key2) {
    if (key1.key !== key2.key) {
        return false;
    }
    var mod1 = key1.modifierKeys;
    var mod2 = key2.modifierKeys;
    if ((!mod1 && mod2) || (mod1 && !mod2)) {
        // Not equal if one modifier is defined and the other isn't
        return false;
    }
    if (mod1 && mod2) {
        if (mod1.length !== mod2.length) {
            return false;
        }
        // Sort both arrays
        mod1 = mod1.sort();
        mod2 = mod2.sort();
        for (var i = 0; i < mod1.length; i++) {
            if (mod1[i] !== mod2[i]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Tests if 'key' is present in 'keys'.
 *
 * @param keys - Array of IKeytipTransitionKey.
 * @param key - IKeytipTransitionKey to find in 'keys'.
 * @returns T/F if 'keys' contains 'key'.
 */
export function transitionKeysContain(keys, key) {
    return !!find(keys, function (transitionKey) {
        return transitionKeysAreEqual(transitionKey, key);
    });
}
//# sourceMappingURL=IKeytipTransitionKey.js.map