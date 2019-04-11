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
const Router_1 = require("./Router");
function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}
function addBasename(basename, location) {
    if (!basename)
        return location;
    return Object.assign({}, location, { pathname: addLeadingSlash(basename) + location.pathname });
}
function stripBasename(basename, location) {
    if (!basename)
        return location;
    const base = addLeadingSlash(basename);
    if (location.pathname.indexOf(base) !== 0)
        return location;
    return Object.assign({}, location, { pathname: location.pathname.substr(base.length) });
}
function createURL(location) {
    return typeof location === 'string' ? location : H.createPath(location);
}
function staticHandler(methodName) {
    return () => {
        console.error('You cannot %s with <StaticRouter>', methodName);
    };
}
function noop() { }
class StaticRouter extends React.Component {
    constructor() {
        super(...arguments);
        this.handlePush = (location) => this.navigateTo(location, 'PUSH');
        this.handleReplace = (location) => this.navigateTo(location, 'REPLACE');
        this.handleListen = () => noop;
        this.handleBlock = () => noop;
    }
    navigateTo(location, action) {
        const { basename = '', context = {} } = this.props;
        context.action = action;
        context.location = addBasename(basename, H.createLocation(location));
        context.url = createURL(context.location);
    }
    render() {
        const _a = this.props, { basename = '', context = {}, location = '/' } = _a, rest = __rest(_a, ["basename", "context", "location"]);
        const history = {
            createHref: (path) => addLeadingSlash(basename + createURL(path)),
            action: 'POP',
            location: stripBasename(basename, H.createLocation(location)),
            push: this.handlePush,
            replace: this.handleReplace,
            go: staticHandler('go'),
            goBack: staticHandler('goBack'),
            goForward: staticHandler('goForward'),
            listen: this.handleListen,
            block: this.handleBlock
        };
        return React.createElement(Router_1.default, Object.assign({}, rest, { history: history, staticContext: context }));
    }
}
exports.default = StaticRouter;
