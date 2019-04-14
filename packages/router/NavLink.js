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
const Link_1 = require("./Link");
const Route_1 = require("./Route");
function joinClassnames(...classnames) {
    return classnames.filter((i) => i).join(' ');
}
function NavLink(_a) {
    var { 'aria-current': ariaCurrent = 'page', activeClassName = 'active', activeStyle, className: classNameProp, exact, isActive: isActiveProp, location: locationProp, strict, style: styleProp, to } = _a, rest = __rest(_a, ['aria-current', "activeClassName", "activeStyle", "className", "exact", "isActive", "location", "strict", "style", "to"]);
    const path = typeof to === 'object' ? to.pathname : to;
    const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    return (React.createElement(Route_1.default, { path: escapedPath, exact: exact, strict: strict, location: locationProp }, ({ location, match }) => {
        const isActive = !!(isActiveProp
            ? isActiveProp(match, location)
            : match);
        const className = isActive
            ? joinClassnames(classNameProp, activeClassName)
            : classNameProp;
        const style = isActive ? Object.assign({}, styleProp, activeStyle) : styleProp;
        return (React.createElement(Link_1.default, Object.assign({ "aria-current": (isActive && ariaCurrent) || null, className: className, style: style, to: to }, rest)));
    }));
}
exports.default = NavLink;
