"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const box_1 = require("@samoyed/box");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
class Switch extends React.Component {
    render() {
        return (React.createElement(RouterContext_1.default.Consumer, null, context => {
            const location = context.location;
            let match = null;
            let element;
            let array = [];
            React.Children.forEach(this.props.children, (child, index) => {
                if (React.isValidElement(child)) {
                    const path = child.props.path || child.props.from;
                    match = path
                        ? matchPath_1.default(location.pathname, Object.assign({}, child.props, { path }))
                        : context.match;
                    if (match) {
                        array.push(React.cloneElement(child, { location, key: child.key || index }));
                    }
                }
            });
            return (React.createElement(box_1.default, { className: "s-router-switch", layout: "card" }, array));
        }));
    }
}
exports.default = Switch;
