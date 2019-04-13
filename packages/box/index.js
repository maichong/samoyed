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
const app_1 = require("@samoyed/app");
class Box extends React.Component {
    render() {
        const _a = this.props, { children, className, innerClassName, elRef, innerRef, layout, flex, scrollable, previous, last, active } = _a, others = __rest(_a, ["children", "className", "innerClassName", "elRef", "innerRef", "layout", "flex", "scrollable", "previous", "last", "active"]);
        let LayoutComponent = 'div';
        let layoutClassName = `s-layout-${layout || 'vbox'}`;
        if (layout === 'card') {
            LayoutComponent = app_1.default.views.CardLayout;
            layoutClassName = '';
            if (!LayoutComponent) {
                throw new Error('@samoyed/card-layout must be required!');
            }
        }
        return (React.createElement("div", Object.assign({ ref: elRef, className: classnames('s-box', className, {
                's-flex': !!flex,
                's-previous': previous,
                's-last': last,
                's-active': active,
            }) }, others),
            React.createElement(LayoutComponent, { ref: innerRef, className: classnames('s-box-inner', innerClassName, layoutClassName, { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' }, { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' }) }, children)));
    }
}
exports.default = Box;
