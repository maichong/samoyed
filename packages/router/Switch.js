"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const box_1 = require("@samoyed/box");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
class Switch extends React.Component {
    render() {
        return (React.createElement(RouterContext_1.default.Consumer, null, context => {
            console.log('switch context', context);
            const routesWithEntries = [];
            const entriesWithRoute = [];
            const entriesKeys = [];
            const needFree = [];
            const routes = [];
            function getEntryRoute(entry) {
                for (let i in routes) {
                    let route = routes[i];
                    const path = route.props.path || route.props.from;
                    let match = matchPath_1.default(entry.pathname, Object.assign({}, route.props, { path }));
                    if (match) {
                        return { entry, route, routeIndex: i, match };
                    }
                }
                return { entry, routeIndex: -1 };
            }
            React.Children.forEach(this.props.children, (child) => {
                if (React.isValidElement(child)) {
                    routes.push(child);
                }
            });
            routes.forEach((child) => {
                let routeEntries = [];
                context.entries.forEach((entry, index) => {
                    const path = child.props.path || child.props.from;
                    let match = matchPath_1.default(entry.pathname, Object.assign({}, child.props, { path }));
                    if (match) {
                        routeEntries.push({ entry, index, match });
                    }
                });
                routesWithEntries.push({ route: child, entries: routeEntries });
            });
            context.entries.forEach((entry) => {
                entriesKeys.push(entry.key);
                entriesWithRoute.push(getEntryRoute(entry));
            });
            routesWithEntries.forEach(({ route, entries }) => {
                if (route.props.historyLimit && entries.length > route.props.historyLimit) {
                    let startIndex = entries[0].index;
                    let endIndex = entries[entries.length - route.props.historyLimit].index;
                    for (let i = startIndex; i < endIndex; i++) {
                        let key = context.entries[i].key;
                        if (needFree.indexOf(key) === -1) {
                            needFree.push(key);
                        }
                    }
                }
            });
            if (needFree.length) {
                setTimeout(() => context.freeEntries(needFree));
            }
            console.log({
                routesWithEntries,
                needFree
            });
            let item = entriesWithRoute[entriesWithRoute.length - 1];
            let children = [React.cloneElement(item.route, {
                    key: item.route.key || 0,
                    location: item.entry,
                    entries: (routesWithEntries[item.routeIndex]).entries.map((e) => e.entry),
                })];
            const last = context.last;
            if (last) {
                let lastEntryRoute = getEntryRoute(last);
                if (lastEntryRoute.route) {
                    children.push(React.cloneElement(lastEntryRoute.route, {
                        key: lastEntryRoute.route.key || 1,
                        location: lastEntryRoute.entry,
                        entries: (routesWithEntries[lastEntryRoute.routeIndex]).entries.map((e) => e.entry),
                    }));
                }
            }
            return (React.createElement(box_1.default, { className: "s-router-switch" }, children));
        }));
    }
}
exports.default = Switch;
