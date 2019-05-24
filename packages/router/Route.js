"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
function isEmptyChildren(children) {
    return React.Children.count(children) === 0;
}
class Route extends React.Component {
    render() {
        return (React.createElement(RouterContext_1.default.Consumer, null, (context) => {
            let { children, component, render, entries, last, previous, active } = this.props;
            const location = this.props.location || context.location;
            if (Array.isArray(children) && children.length === 0) {
                children = null;
            }
            const match = this.props.computedMatch || (this.props.path ? matchPath_1.default(location.pathname, this.props) : context.match);
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
        }));
    }
}
exports.default = Route;
