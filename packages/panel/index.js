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
const toolbar_1 = require("@samoyed/toolbar");
function Panel(props) {
    let { icon, title, titleAlign, tools, header, headerPlacement, color, border, children, className, bodyClassName, bodyStyle, bodyPadding } = props, others = __rest(props, ["icon", "title", "titleAlign", "tools", "header", "headerPlacement", "color", "border", "children", "className", "bodyClassName", "bodyStyle", "bodyPadding"]);
    if (!header && (icon || title || tools)) {
        header = React.createElement(toolbar_1.default, { color: color, icon: icon, title: title, tools: tools, titleAlign: titleAlign, placement: headerPlacement || 'top' });
    }
    let colorCls = color ? `s-panel-${color}` : '';
    if (bodyPadding !== false && bodyPadding !== 0) {
        bodyStyle = bodyStyle ? Object.assign({}, bodyStyle) : {};
        bodyStyle.padding = bodyPadding || '0.5rem';
    }
    return (React.createElement(box_1.default, Object.assign({ className: classnames('s-panel', colorCls, className, { 's-panel-border': border }), bodyClassName: classnames('s-panel-body', bodyClassName) }, others, { bodyStyle: bodyStyle, dock: header, dockPlacement: headerPlacement }), children));
}
exports.default = Panel;
