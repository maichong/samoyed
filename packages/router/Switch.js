"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
const RouterContext_1 = require("./RouterContext");
const matchPath_1 = require("./matchPath");
class Switch extends React.Component {
    constructor() {
        super(...arguments);
        this.handleRef = (ref) => {
            this.elRef = ref;
        };
        this.updateAnimation = () => {
            if (!this.elRef)
                return;
            let classList = this.elRef.classList;
            if (this.animationStage === 'start') {
                this.animationStage = 'active';
                this.animationTimer = setTimeout(this.updateAnimation, this.animation.duration || app_1.default.defaults.switchAnimationDuration);
                if (classList.contains('s-done')) {
                    classList.remove('s-done');
                }
                classList.remove('s-start');
                classList.add('s-active');
            }
            else if (this.animationStage === 'active') {
                this.animationStage = 'done';
                if (classList.contains('s-start')) {
                    classList.remove('s-start');
                }
                classList.remove('s-active');
                classList.add('s-done');
                if (this.last) {
                    this.forceUpdate();
                }
            }
        };
    }
    render() {
        let animation = this.props.animation || {};
        if (typeof animation === 'string') {
            animation = { type: animation };
        }
        this.animation = animation;
        console.warn('Switch.render');
        return (React.createElement(RouterContext_1.default.Consumer, null, context => {
            console.warn('switch context', context);
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
            let children = [];
            let item = entriesWithRoute[entriesWithRoute.length - 1];
            if (item.route) {
                console.error('active', item.entry);
                children.push(React.cloneElement(item.route, {
                    key: 'active',
                    active: true,
                    location: item.entry,
                    entries: (routesWithEntries[item.routeIndex]).entries.map((e) => e.entry),
                }));
            }
            else {
            }
            if (animation.type) {
                const last = context.last;
                let previousEntryRoute = entriesWithRoute[entriesWithRoute.length - 2];
                if (previousEntryRoute && previousEntryRoute.route) {
                    console.error('previous', previousEntryRoute.entry);
                    children.push(React.cloneElement(previousEntryRoute.route, {
                        key: 'previous',
                        previous: true,
                        last: last && last.key === previousEntryRoute.entry.key,
                        location: previousEntryRoute.entry,
                        entries: (routesWithEntries[previousEntryRoute.routeIndex]).entries.map((e) => e.entry),
                    }));
                }
                this.last = null;
                if (this.animationLock !== item.entry.key) {
                    this.animationLock = item.entry.key;
                    if (last && entriesKeys.indexOf(last.key) === -1) {
                        let lastEntryRoute = getEntryRoute(last);
                        this.animationAction = 'backward';
                        if (lastEntryRoute.route) {
                            this.last = lastEntryRoute.entry;
                            console.error('last', lastEntryRoute.entry);
                            children.push(React.cloneElement(lastEntryRoute.route, {
                                key: 'last',
                                last: true,
                                location: lastEntryRoute.entry,
                                entries: (routesWithEntries[lastEntryRoute.routeIndex]).entries.map((e) => e.entry),
                            }));
                        }
                    }
                    this.animationStage = 'start';
                    this.animationAction = context.action === 'POP' ? 'backward' : 'forward';
                    if (this.animationTimer)
                        clearTimeout(this.animationTimer);
                    this.animationTimer = setTimeout(this.updateAnimation);
                    if (this.elRef) {
                        let classList = this.elRef.classList;
                        if (!classList.contains('s-start'))
                            classList.add('s-start');
                        if (classList.contains('s-active'))
                            classList.remove('s-active');
                        if (classList.contains('s-done'))
                            classList.remove('s-done');
                        if (this.animationAction === 'forward') {
                            if (!classList.contains('s-forward'))
                                classList.add('s-forward');
                            if (classList.contains('s-backward'))
                                classList.remove('s-backward');
                        }
                        else {
                            if (!classList.contains('s-backward'))
                                classList.add('s-backward');
                            if (classList.contains('s-forward'))
                                classList.remove('s-forward');
                        }
                    }
                }
            }
            console.log('children', children);
            return (React.createElement("div", { ref: this.handleRef, className: classnames('s-router-switch', {
                    's-animation': this.animation.type,
                    's-forward': this.animation.type && this.animationAction === 'forward',
                    's-backward': this.animation.type && this.animationAction === 'backward',
                    [`s-${this.animation.type}`]: this.animation.type,
                    's-start': this.animation.type && this.animationStage === 'start'
                }) }, children));
        }));
    }
}
exports.default = Switch;
