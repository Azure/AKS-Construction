import { __rest } from "tslib";
import { DATAKTP_TARGET, DATAKTP_EXECUTE_TARGET } from '../../utilities/keytips/index';
import { useKeytipData } from './useKeytipData';
/**
 * A small element to help the target component correctly read out its aria-describedby for its Keytip
 * {@docCategory Keytips}
 */
export var KeytipData = function (props) {
    var _a;
    var children = props.children, keytipDataProps = __rest(props, ["children"]);
    var _b = useKeytipData(keytipDataProps), keytipId = _b.keytipId, ariaDescribedBy = _b.ariaDescribedBy;
    return children((_a = {},
        _a[DATAKTP_TARGET] = keytipId,
        _a[DATAKTP_EXECUTE_TARGET] = keytipId,
        _a['aria-describedby'] = ariaDescribedBy,
        _a));
};
//# sourceMappingURL=KeytipData.js.map