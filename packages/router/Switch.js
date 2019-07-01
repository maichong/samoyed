"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
const RouterContext_1 = require("./RouterContext");
const Redirect_1 = require("./Redirect");
const matchPath_1 = require("./matchPath");
function getLocationRoute(location, routes) {
    for (let i in routes) {
        let route = routes[i];
        const path = route.props.path || '/';
        let match = matchPath_1.default(location.pathname, Object.assign({}, route.props, { path }));
        if (match) {
            return { route, routeIndex: i, match };
        }
    }
    return {};
}
function Runner(obj, duration, animationActive, classes) {
    function updateStage(stage) {
        obj.elRef.className = classnames('s-component s-router-switch', classes, {
            [`s-${stage}`]: animationActive
        });
    }
    if (obj.elRef) {
        updateStage('start');
        if (!animationActive)
            return;
    }
    let timer = setTimeout(() => {
        updateStage('start');
        if (!animationActive) {
            return;
        }
        timer = setTimeout(() => {
            updateStage('running');
            timer = setTimeout(() => {
                updateStage('done');
                timer = 0;
            }, duration || app_1.default.defaults.animationDuration);
        }, 50);
    });
    return function clearup() {
        if (timer) {
            clearTimeout(timer);
        }
    };
}
class Switch extends React.Component {
    constructor() {
        super(...arguments);
        this.handleRef = (ref) => {
            this.elRef = ref;
        };
    }
    componentWillUnmount() {
        if (this.clear) {
            this.clear();
            this.clear = null;
        }
    }
    render() {
        const tabMode = this.props.tabMode;
        let animation = this.props.animation || {};
        if (typeof animation === 'string') {
            animation = { type: animation };
        }
        const duration = animation.duration || app_1.default.defaults.switchAnimationDuration;
        return (React.createElement(RouterContext_1.default.Consumer, null, (context) => {
            let animationActive = false;
            if (!context || !context.history)
                throw new Error('You should not use <Switch> outside a <Router>');
            let { locationStack, location, direction } = context;
            const routes = [];
            React.Children.forEach(this.props.children, (child) => {
                if (React.isValidElement(child)) {
                    routes.push(child);
                }
            });
            let children = [];
            let { route: activeRoute, routeIndex: activeRouteIndex, match: activeMatch } = getLocationRoute(location, routes);
            if (!activeRoute) {
                console.error('No route found for location', location);
                return null;
            }
            let lastLocation = this.lastLocation;
            if (activeRoute.type === Redirect_1.default && location.key !== context.globalLocation.key) {
                activeRoute = null;
            }
            if (activeRoute) {
                let matcher = Object.assign({}, activeRoute.props, { path: activeRoute.props.path || '/' });
                let childLoactionList = locationStack.filter((loc) => matchPath_1.default(loc.pathname, matcher));
                if (matcher.exact) {
                    if (lastLocation && lastLocation.key === location.key) {
                        lastLocation = null;
                    }
                    if (!this.lastLocation || this.lastLocation.key !== location.key) {
                        this.lastLocation = location;
                        this.lastRoutePath = activeMatch.path;
                    }
                }
                else {
                    if (lastLocation && this.lastRoutePath === activeMatch.path) {
                        lastLocation = null;
                    }
                    if (!this.lastLocation || this.lastRoutePath !== activeMatch.path) {
                        this.lastLocation = location;
                        this.lastRoutePath = activeMatch.path;
                    }
                }
                children.push(React.cloneElement(activeRoute, {
                    key: matcher.exact ? location.key : matcher.path,
                    active: true,
                    lastLocation,
                    location,
                    locationStack: childLoactionList,
                    computedMatch: activeMatch
                }));
                if (matcher.historyLimit && childLoactionList.length > matcher.historyLimit) {
                    let needFree = [];
                    let startIndex = locationStack.indexOf(childLoactionList[0]);
                    let endIndex = locationStack.indexOf(childLoactionList[childLoactionList.length - matcher.historyLimit]);
                    for (let i = startIndex; i < endIndex; i += 1) {
                        needFree.push(locationStack[i].key);
                    }
                    if (needFree.length) {
                        window.setTimeout(() => context.freeLocations(needFree));
                    }
                }
            }
            if (animation.type && lastLocation && this.animationLock !== location.key) {
                let { route: lastRoute, routeIndex: lastRouteIndex, match: lastMatch } = getLocationRoute(lastLocation, routes);
                if (lastRoute) {
                    let matcher = Object.assign({}, lastRoute.props, { path: lastRoute.props.path || '/' });
                    let childLoactionList = locationStack.filter((loc) => matchPath_1.default(loc.pathname, matcher));
                    let el = React.cloneElement(lastRoute, {
                        key: matcher.exact ? lastLocation.key : matcher.path,
                        last: true,
                        lastLocation: null,
                        location: lastLocation,
                        locationStack: childLoactionList,
                        computedMatch: lastMatch
                    });
                    if (direction === 'forward') {
                        children.unshift(el);
                    }
                    else {
                        children.push(el);
                    }
                    this.animationLock = location.key;
                    animationActive = true;
                    if (tabMode && activeRouteIndex !== lastRouteIndex) {
                        direction = activeRouteIndex > lastRouteIndex ? 'forward' : 'backward';
                    }
                }
            }
            if (this.clear) {
                this.clear();
            }
            this.clear = Runner(this, duration, animationActive, {
                's-animation': animation.type,
                's-vertical': animation.type && animation.direction === 'vertical',
                's-horizontal': animation.type && animation.direction !== 'vertical',
                's-forward': animation.type && direction === 'forward',
                's-backward': animation.type && direction === 'backward',
                [`s-duration-${duration}`]: animation.type,
                [`s-${animation.type}`]: animation.type,
            });
            if (this.elRef && !animationActive) {
                this.elRef.classList.remove('s-animation');
            }
            return (React.createElement("div", { ref: this.handleRef }, children));
        }));
    }
}
exports.default = Switch;
