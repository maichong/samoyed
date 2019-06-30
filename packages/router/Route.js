"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
function isEmptyChildren(children) {
    return React.Children.count(children) === 0;
}
function Route(props) {
    let { children, component, render, entries, last, previous, active } = props;
    let context = React.useContext(RouterContext_1.default);
    const location = props.location || context.location;
    if (Array.isArray(children) && children.length === 0) {
        children = null;
    }
    const match = props.computedMatch || (props.path ? matchPath_1.default(location.pathname, props) : context.match);
    const childContext = Object.assign({}, context, { location,
        match, entries: entries || context.entries });
    const childProps = {
        history: context.history,
        location,
        match,
        active,
        last,
        previous,
        router: childContext
    };
    if (typeof children === 'function') {
        children = children(childProps);
        if (typeof children === 'undefined') {
            children = null;
        }
    }
    return (React.createElement(RouterContext_1.default.Provider, { value: childContext }, children && !isEmptyChildren(children)
        ? children
        : childContext.match
            ? component
                ? React.createElement(component, childProps)
                : render
                    ? render(childProps)
                    : null
            : null));
}
exports.default = Route;
