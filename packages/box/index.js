"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
class Box extends React.Component {
    render() {
        const _a = this.props, { children, className, innerClassName, boxRef, innerRef, layout, flex, scrollable } = _a, others = __rest(_a, ["children", "className", "innerClassName", "boxRef", "innerRef", "layout", "flex", "scrollable"]);
        return (React.createElement("div", Object.assign({ ref: boxRef, className: classnames('s-box', className, { 's-flex': !!flex }) }, others),
            React.createElement("div", { ref: innerRef, className: classnames('s-box-inner', innerClassName, `s-layout-${layout || 'vbox'}`, { 's-scrollable-x': scrollable === 'both' || scrollable === 'x' }, { 's-scrollable-y': scrollable === 'both' || scrollable === 'y' }) }, children)));
    }
}
exports.default = Box;
