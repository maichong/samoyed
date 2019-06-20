"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toFixed(value) {
    return parseFloat(value.toFixed(8));
}
function getSmallerSortValue(v = 0, current = 0) {
    v = Math.min(v, current);
    if (v > 2) {
        return toFixed(v / 2);
    }
    return v - 10000;
}
function getBiggerSortValue(v = 0, current = 0) {
    v = Math.max(v, current);
    return v + 10000;
}
function dropSort(params) {
    const { oldList, newList, dragging, order } = params;
    let oldIndex = oldList.indexOf(dragging);
    let newIndex = newList.indexOf(dragging);
    if (oldIndex === newIndex)
        dragging.sort;
    let value = dragging.sort || 0;
    if (newIndex === oldList.length - 1) {
        let last = oldList[newIndex];
        let sortValue = last.sort;
        if (order === 'asc') {
            value = getBiggerSortValue(sortValue, value);
        }
        else {
            value = getSmallerSortValue(sortValue, value);
        }
    }
    else if (newIndex === 0) {
        let sortValue = oldList[0].sort;
        if (order === 'asc') {
            value = getSmallerSortValue(sortValue, value);
        }
        else {
            value = getBiggerSortValue(sortValue, value);
        }
    }
    else {
        let before = newList[newIndex - 1].sort || 0;
        let after = newList[newIndex + 1].sort || 0;
        if (before === after) {
            value = before;
        }
        else {
            value = toFixed((after - before) / 2) + before;
            let intSort = parseInt(value);
            if ((before < intSort && intSort < after)
                || (before > intSort && intSort > after)) {
                value = intSort;
            }
        }
    }
    return value;
}
exports.default = dropSort;
