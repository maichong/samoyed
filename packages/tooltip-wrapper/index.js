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
const random = require("string-random");
const Tooltip = require('react-bootstrap/Tooltip');
const OverlayTrigger = require('react-bootstrap/OverlayTrigger');
class TooltipWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.id = random();
    }
    render() {
        const _a = this.props, { children, tooltip } = _a, others = __rest(_a, ["children", "tooltip"]);
        return (React.createElement(OverlayTrigger, Object.assign({ overlay: React.createElement(Tooltip, { id: this.id }, tooltip) }, others), children));
    }
}
TooltipWrapper.defaultProps = {
    placement: 'top'
};
exports.default = TooltipWrapper;
