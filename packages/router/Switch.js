"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
class Switch extends React.Component {
    render() {
        return (React.createElement(RouterContext_1.default.Consumer, null, context => {
            const location = this.props.location || context.location;
            let match = null;
            let element;
            React.Children.forEach(this.props.children, (child) => {
                if (match == null && React.isValidElement(child)) {
                    element = child;
                    const path = child.props.path || child.props.from;
                    match = path
                        ? matchPath_1.default(location.pathname, Object.assign({}, child.props, { path }))
                        : context.match;
                }
            });
            return match
                ? React.cloneElement(element, { location, computedMatch: match })
                : null;
        }));
    }
}
exports.default = Switch;
