import { __assign, __extends, __rest } from "tslib";
import * as React from 'react';
import { classNamesFunction, css } from '../../Utilities';
import { SelectionMode } from '../../Selection';
import { DetailsList } from './DetailsList';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from '../../Shimmer';
import { CheckboxVisibility } from './DetailsList.types';
import { DEFAULT_CELL_STYLE_PROPS, DEFAULT_ROW_HEIGHTS } from './DetailsRow.styles';
var getClassNames = classNamesFunction();
var SHIMMER_INITIAL_ITEMS = 10;
var DEFAULT_SHIMMER_HEIGHT = 7;
var SHIMMER_LINE_VS_CELL_WIDTH_RATIO = 0.95;
var ShimmeredDetailsListBase = /** @class */ (function (_super) {
    __extends(ShimmeredDetailsListBase, _super);
    function ShimmeredDetailsListBase(props) {
        var _this = _super.call(this, props) || this;
        _this._onRenderShimmerPlaceholder = function (index, rowProps) {
            var onRenderCustomPlaceholder = _this.props.onRenderCustomPlaceholder;
            var placeholderElements = onRenderCustomPlaceholder
                ? onRenderCustomPlaceholder(rowProps, index, _this._renderDefaultShimmerPlaceholder)
                : _this._renderDefaultShimmerPlaceholder(rowProps);
            return React.createElement(Shimmer, { customElementsGroup: placeholderElements });
        };
        _this._renderDefaultShimmerPlaceholder = function (rowProps) {
            var columns = rowProps.columns, compact = rowProps.compact, selectionMode = rowProps.selectionMode, checkboxVisibility = rowProps.checkboxVisibility, _a = rowProps.cellStyleProps, cellStyleProps = _a === void 0 ? DEFAULT_CELL_STYLE_PROPS : _a;
            var rowHeight = DEFAULT_ROW_HEIGHTS.rowHeight, compactRowHeight = DEFAULT_ROW_HEIGHTS.compactRowHeight;
            // 1px to take into account the border-bottom of DetailsRow.
            var gapHeight = compact ? compactRowHeight : rowHeight + 1;
            var shimmerElementsRow = [];
            var showCheckbox = selectionMode !== SelectionMode.none && checkboxVisibility !== CheckboxVisibility.hidden;
            if (showCheckbox) {
                shimmerElementsRow.push(React.createElement(ShimmerElementsGroup, { key: 'checkboxGap', shimmerElements: [{ type: ShimmerElementType.gap, width: '40px', height: gapHeight }] }));
            }
            columns.forEach(function (column, columnIdx) {
                var shimmerElements = [];
                var groupWidth = cellStyleProps.cellLeftPadding +
                    cellStyleProps.cellRightPadding +
                    column.calculatedWidth +
                    (column.isPadded ? cellStyleProps.cellExtraRightPadding : 0);
                shimmerElements.push({
                    type: ShimmerElementType.gap,
                    width: cellStyleProps.cellLeftPadding,
                    height: gapHeight,
                });
                if (column.isIconOnly) {
                    shimmerElements.push({
                        type: ShimmerElementType.line,
                        width: column.calculatedWidth,
                        height: column.calculatedWidth,
                    });
                    shimmerElements.push({
                        type: ShimmerElementType.gap,
                        width: cellStyleProps.cellRightPadding,
                        height: gapHeight,
                    });
                }
                else {
                    shimmerElements.push({
                        type: ShimmerElementType.line,
                        width: column.calculatedWidth * SHIMMER_LINE_VS_CELL_WIDTH_RATIO,
                        height: DEFAULT_SHIMMER_HEIGHT,
                    });
                    shimmerElements.push({
                        type: ShimmerElementType.gap,
                        width: cellStyleProps.cellRightPadding +
                            (column.calculatedWidth - column.calculatedWidth * SHIMMER_LINE_VS_CELL_WIDTH_RATIO) +
                            (column.isPadded ? cellStyleProps.cellExtraRightPadding : 0),
                        height: gapHeight,
                    });
                }
                shimmerElementsRow.push(React.createElement(ShimmerElementsGroup, { key: columnIdx, width: groupWidth + "px", shimmerElements: shimmerElements }));
            });
            // When resizing the window from narrow to wider, we need to cover the exposed Shimmer wave
            // until the column resizing logic is done.
            shimmerElementsRow.push(React.createElement(ShimmerElementsGroup, { key: 'endGap', width: '100%', shimmerElements: [{ type: ShimmerElementType.gap, width: '100%', height: gapHeight }] }));
            return React.createElement("div", { style: { display: 'flex' } }, shimmerElementsRow);
        };
        _this._shimmerItems = props.shimmerLines ? new Array(props.shimmerLines) : new Array(SHIMMER_INITIAL_ITEMS);
        return _this;
    }
    ShimmeredDetailsListBase.prototype.render = function () {
        var _a = this.props, detailsListStyles = _a.detailsListStyles, enableShimmer = _a.enableShimmer, items = _a.items, listProps = _a.listProps, onRenderCustomPlaceholder = _a.onRenderCustomPlaceholder, removeFadingOverlay = _a.removeFadingOverlay, shimmerLines = _a.shimmerLines, styles = _a.styles, theme = _a.theme, ariaLabelForGrid = _a.ariaLabelForGrid, ariaLabelForShimmer = _a.ariaLabelForShimmer, restProps = __rest(_a, ["detailsListStyles", "enableShimmer", "items", "listProps", "onRenderCustomPlaceholder", "removeFadingOverlay", "shimmerLines", "styles", "theme", "ariaLabelForGrid", "ariaLabelForShimmer"]);
        var listClassName = listProps && listProps.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
        });
        var newListProps = __assign(__assign({}, listProps), { 
            // Adds to the optional listProp className a fading out overlay className only when `enableShimmer` toggled on
            // and the overlay is not disabled by `removeFadingOverlay` prop.
            className: enableShimmer && !removeFadingOverlay ? css(this._classNames.root, listClassName) : listClassName });
        return (React.createElement(DetailsList, __assign({}, restProps, { styles: detailsListStyles, items: enableShimmer ? this._shimmerItems : items, isPlaceholderData: enableShimmer, ariaLabelForGrid: (enableShimmer && ariaLabelForShimmer) || ariaLabelForGrid, onRenderMissingItem: this._onRenderShimmerPlaceholder, listProps: newListProps })));
    };
    return ShimmeredDetailsListBase;
}(React.Component));
export { ShimmeredDetailsListBase };
//# sourceMappingURL=ShimmeredDetailsList.base.js.map