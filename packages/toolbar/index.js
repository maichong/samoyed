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
const icon_1 = require("@samoyed/icon");
const tooltip_wrapper_1 = require("@samoyed/tooltip-wrapper");
const PLACEMENT_LAYOUT = {
    top: 'horizontal',
    bottom: 'horizontal',
    left: 'vertical',
    right: 'vertical'
};
function Toolbar(props) {
    const { children, className, bodyClassName, placement = 'top', color, icon, title, titleAlign, tools } = props, others = __rest(props, ["children", "className", "bodyClassName", "placement", "color", "icon", "title", "titleAlign", "tools"]);
    let content;
    if (icon || title) {
        content = React.createElement("div", { className: classnames(`s-toolbar-title s-flex s-align-${titleAlign || 'left'}`, {
                's-has-icon': icon,
                's-has-text': title,
            }) },
            icon && React.createElement(icon_1.default, { name: icon }),
            title && React.isValidElement(title) ? title : React.createElement("span", { className: "s-text" }, title));
    }
    let leftTools = [];
    let rightTools = [];
    tools && tools.forEach((tool, index) => {
        if (React.isValidElement(tool)) {
            rightTools.push(tool);
            return;
        }
        let list = tool.placement === 'left' ? leftTools : rightTools;
        let colorCls = tool.color ? `text-${tool.color}` : '';
        let el = React.createElement("div", { key: index, onClick: tool.disabled ? null : tool.onClick, className: classnames('s-tool', colorCls, {
                's-has-icon': tool.icon,
                's-has-text': tool.text,
                's-disabled': tool.disabled,
                's-hover': !tool.disabled,
            }) },
            tool.icon && React.createElement(icon_1.default, { name: tool.icon }),
            tool.text && (React.isValidElement(tool.text) ? tool.text : React.createElement("span", { className: "s-text" }, tool.text)));
        if (tool.tooltip) {
            el = React.createElement(tooltip_wrapper_1.default, { key: index, placement: "bottom", tooltip: tool.tooltip }, el);
        }
        list.push(el);
    });
    return (React.createElement(box_1.default, Object.assign({ className: classnames(`s-toolbar s-toolbar-${placement}`, className, {
            [`s-toolbar-${color}`]: color
        }), bodyClassName: classnames('s-toolbar-body', bodyClassName), bg: color, layout: PLACEMENT_LAYOUT[placement] }, others),
        React.createElement("div", { className: "s-toolbar-start" }, leftTools),
        content,
        children,
        React.createElement("div", { className: "s-toolbar-end" }, rightTools)));
}
exports.default = Toolbar;
