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
        return (React.createElement(RouterContext_1.default.Consumer, null, context => {
            const location = this.props.location || context.location;
            const match = this.props.computedMatch
                ? this.props.computedMatch
                : this.props.path
                    ? matchPath_1.default(location.pathname, this.props)
                    : context.match;
            const props = Object.assign({}, context, { location, match });
            let { children, component, render } = this.props;
            if (Array.isArray(children) && children.length === 0) {
                children = null;
            }
            if (typeof children === 'function') {
                children = children(props);
                if (typeof children === 'undefined') {
                    children = null;
                }
            }
            return (React.createElement(RouterContext_1.default.Provider, { value: props }, children && !isEmptyChildren(children)
                ? children
                : props.match
                    ? component
                        ? React.createElement(component, props)
                        : render
                            ? render(props)
                            : null
                    : null));
        }));
    }
}
exports.default = Route;
