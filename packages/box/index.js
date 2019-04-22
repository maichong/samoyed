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
function Box(props) {
    const { children, className, bodyClassName, elRef, bodyRef, flex, scrollable, layout, activeItem, animation, previous, last, active, wrapper, wrapperProps } = props, others = __rest(props, ["children", "className", "bodyClassName", "elRef", "bodyRef", "flex", "scrollable", "layout", "activeItem", "animation", "previous", "last", "active", "wrapper", "wrapperProps"]);
    let layoutProps = {
        ref: bodyRef
    };
    let LayoutComponent = 'div';
    let layoutClassName = `s-layout-${layout || 'auto'}`;
    if (layout === 'card') {
        LayoutComponent = app_1.default.components.CardLayout;
        layoutProps.activeItem = activeItem;
        layoutProps.animation = animation;
        if (!LayoutComponent) {
            throw new Error('@samoyed/card-layout must be required!');
        }
    }
    layoutProps.className = classnames('s-box-body', bodyClassName, { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' }, { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' });
    let el = (React.createElement("div", Object.assign({ ref: elRef, className: classnames('s-component', 's-box', className, layoutClassName, {
            's-flex': !!flex,
            's-previous': previous,
            's-last': last,
            's-active': active,
        }) }, others),
        React.createElement(LayoutComponent, Object.assign({}, layoutProps), children)));
    if (wrapper) {
        if (app_1.default._wrapperHooks.indexOf(wrapper) == -1) {
            app_1.default._wrapperHooks.push(wrapper);
        }
        let wrappers = app_1.default.wrappers[wrapper];
        if (wrappers && wrappers.length) {
            el = wrappers.reduce((c, Wrapper) => React.createElement(Wrapper, wrapperProps, c), el);
        }
    }
    return el;
}
exports.default = Box;
app_1.default.components.Box = Box;
