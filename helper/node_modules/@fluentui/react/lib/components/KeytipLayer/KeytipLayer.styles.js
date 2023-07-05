import { ZIndexes } from '../../Styling';
export var getLayerStyles = function (props) {
    return {
        root: [
            {
                // Prioritize the Keytips above all other Layers
                zIndex: ZIndexes.KeytipLayer,
            },
        ],
    };
};
export var getStyles = function (props) {
    return {
        innerContent: [
            {
                position: 'absolute',
                width: 0,
                height: 0,
                margin: 0,
                padding: 0,
                border: 0,
                overflow: 'hidden',
                visibility: 'hidden',
            },
        ],
    };
};
//# sourceMappingURL=KeytipLayer.styles.js.map