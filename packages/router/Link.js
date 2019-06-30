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
function Link(props) {
    const { innerRef, replace, to, onClick } = props, rest = __rest(props, ["innerRef", "replace", "to", "onClick"]);
    let context = React.useContext(RouterContext_1.default);
    if (!context || !context.history)
        throw new Error('You should not use <Link> outside a <Router>');
    const location = typeof to === 'string'
        ? H.createLocation(to, null, null, context.location)
        : to;
    const href = location ? context.history.createHref(location) : '';
    const handleClick = (event) => {
        if (onClick)
            onClick(event);
        if (!event.defaultPrevented &&
            event.button === 0 &&
            (!props.target || props.target === '_self') &&
            !isModifiedEvent(event)) {
            event.preventDefault();
            const method = replace ? context.history.replace : context.history.push;
            method(to);
        }
    };
    return (React.createElement("a", Object.assign({}, rest, { onClick: handleClick, href: href, ref: innerRef })));
}
exports.default = Link;
