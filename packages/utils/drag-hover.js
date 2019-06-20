"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function dragHover(params) {
    const { list, dragging, hover } = params;
    if (!dragging || list.length < 2)
        return null;
    if (dragging === hover)
        return null;
    let draggingIndex = list.indexOf(dragging);
    let hoverIndex = list.indexOf(hover);
    if (draggingIndex < 0 || hoverIndex < 0)
        return null;
    return _.flatMap(list, (record) => {
        if (record === dragging) {
            return [];
        }
        if (record === hover) {
            if (draggingIndex > hoverIndex) {
                return [dragging, hover];
            }
            return [hover, dragging];
        }
        return [record];
    });
}
exports.default = dragHover;
