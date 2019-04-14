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
const H = require("history");
const RouterContext_1 = require("./RouterContext");
function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
class Link extends React.Component {
    handleClick(event, history) {
        if (this.props.onClick)
            this.props.onClick(event);
        if (!event.defaultPrevented &&
            event.button === 0 &&
            (!this.props.target || this.props.target === '_self') &&
            !isModifiedEvent(event)) {
            event.preventDefault();
            const method = this.props.replace ? history.replace : history.push;
            method(this.props.to);
        }
    }
    render() {
        const _a = this.props, { innerRef, replace, to } = _a, rest = __rest(_a, ["innerRef", "replace", "to"]);
        return (React.createElement(RouterContext_1.default.Consumer, null, (context) => {
            if (!context || !context.history)
                throw new Error('You should not use <Link> outside a <Router>');
            const location = typeof to === 'string'
                ? H.createLocation(to, null, null, context.location)
                : to;
            const href = location ? context.history.createHref(location) : '';
            return (React.createElement("a", Object.assign({}, rest, { onClick: (event) => this.handleClick(event, context.history), href: href, ref: innerRef })));
        }));
    }
}
exports.default = Link;
