"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const history_1 = require("history");
const RouterContext_1 = require("./RouterContext");
const Lifecycle_1 = require("./Lifecycle");
const generatePath_1 = require("./generatePath");
function Redirect({ computedMatch, to, push = false }) {
    return (React.createElement(RouterContext_1.default.Consumer, null, (context) => {
        if (!context || !context.history)
            throw new Error('You should not use <Redirect> outside a <Router>');
        const { history, staticContext } = context;
        const method = push ? history.push : history.replace;
        const location = history_1.createLocation(computedMatch
            ? typeof to === 'string'
                ? generatePath_1.default(to, computedMatch.params)
                : Object.assign({}, to, { pathname: generatePath_1.default(to.pathname, computedMatch.params) })
            : to);
        if (staticContext) {
            method(location);
            return null;
        }
        return (React.createElement(Lifecycle_1.default, { onMount: () => {
                method(location);
            }, onUpdate: (self, prevProps) => {
                const prevLocation = history_1.createLocation(prevProps.to);
                if (!history_1.locationsAreEqual(prevLocation, Object.assign({}, location, { key: prevLocation.key }))) {
                    method(location);
                }
            }, to: to }));
    }));
}
exports.default = Redirect;
