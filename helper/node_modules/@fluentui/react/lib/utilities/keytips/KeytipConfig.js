import { __assign } from "tslib";
/**
 * Builds a map of ID to IKeytipProps
 *
 * @param config - IKeytipConfig object
 * @returns Config map
 */
export function buildKeytipConfigMap(config) {
    var configMap = {};
    for (var _i = 0, _a = config.keytips; _i < _a.length; _i++) {
        var keytip = _a[_i];
        constructKeytip(configMap, [], keytip);
    }
    return configMap;
}
/**
 * Constructs a keytip from an IKeytipConfigItem and puts it in the configMap
 *
 * @param configMap - IKeytipConfigMap to store the keytip in
 * @param parentSequence - string of the parent keytip
 * @param keytip - IKeytipConfigItem data
 */
export function constructKeytip(configMap, parentSequence, keytip) {
    // Compute full key sequence
    var sequence = keytip.sequence ? keytip.sequence : keytip.content.toLocaleLowerCase();
    var keytipSequence = parentSequence.concat(sequence);
    // Save props in configMap
    var keytipProps = __assign(__assign({}, keytip.optionalProps), { keySequences: keytipSequence, content: keytip.content });
    configMap[keytip.id] = keytipProps;
    if (keytip.children) {
        for (var _i = 0, _a = keytip.children; _i < _a.length; _i++) {
            var child = _a[_i];
            // Create keytips for all children
            constructKeytip(configMap, keytipSequence, child);
        }
    }
}
//# sourceMappingURL=KeytipConfig.js.map