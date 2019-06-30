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
const hoistStatics = require("hoist-non-react-statics");
const RouterContext_1 = require("./RouterContext");
function withRouter(Component) {
    const context = React.useContext(RouterContext_1.default);
    const displayName = `withRouter(${Component.displayName || Component.name})`;
    const C = (props) => {
        const { wrappedComponentRef } = props, remainingProps = __rest(props, ["wrappedComponentRef"]);
        if (!context || !context.history)
            throw new Error('You should not use <withRouter> outside a <Router>');
        return (React.createElement(Component, Object.assign({}, remainingProps, context, { ref: wrappedComponentRef })));
    };
    C.displayName = displayName;
    C.WrappedComponent = Component;
    return hoistStatics(C, Component);
}
exports.default = withRouter;
