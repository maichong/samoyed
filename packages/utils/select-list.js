"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const app_1 = require("@samoyed/app");
function emptyAsNull(data) {
    return !data || _.isEmpty(data) ? null : data;
}
function matchList(list, selector) {
    let { search = '', sort = '', limit = app_1.default.defaults.listLimit || 0 } = selector;
    let matched = list.search === search && list.sort === sort && list.limit === limit;
    if (!matched)
        return false;
    if (!_.isEqual(emptyAsNull(list.filters), emptyAsNull(selector.filters)))
        return false;
    return _.isEqual(emptyAsNull(list.populations), emptyAsNull(selector.populations));
}
exports.matchList = matchList;
function selectList(lists, selector) {
    if (!lists)
        return null;
    for (let i in lists) {
        if (matchList(lists[i], selector)) {
            return lists[i];
        }
    }
    return null;
}
exports.default = selectList;
