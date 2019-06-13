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
const box_1 = require("@samoyed/box");
function Viewport(props) {
    const { children, className, bodyClassName } = props, others = __rest(props, ["children", "className", "bodyClassName"]);
    return (React.createElement(box_1.default, Object.assign({ className: classnames('s-viewport', className), bodyClassName: classnames('s-viewport-body', bodyClassName) }, others), children));
}
exports.default = Viewport;
