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
        const path = route.props.path || route.props.from || '/';
        let match = matchPath_1.default(location.pathname, Object.assign({}, route.props, { path }));
        if (match) {
            return { route, match };
        }
    }
    return {};
}
function Runner(obj, duration) {
    let stage = 'start';
    function updateStage() {
        ['start', 'running', 'done'].forEach((s) => {
            if (s !== stage && obj.elRef.classList.contains(`s-${s}`)) {
                obj.elRef.classList.remove(`s-${s}`);
            }
        });
        if (!obj.elRef.classList.contains(`s-${stage}`)) {
            obj.elRef.classList.add(`s-${stage}`);
        }
    }
    if (obj.elRef) {
        updateStage();
    }
    let timer = setTimeout(() => {
        stage = 'running';
        updateStage();
        updateStage();
        timer = setTimeout(() => {
            stage = 'done';
            updateStage();
            timer = 0;
        }, duration || app_1.default.defaults.animationDuration);
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
        let animation = this.props.animation || {};
        if (typeof animation === 'string') {
            animation = { type: animation };
        }
        const duration = animation.duration || app_1.default.defaults.switchAnimationDuration;
        return (React.createElement(RouterContext_1.default.Consumer, null, (context) => {
            if (!context || !context.history)
                throw new Error('You should not use <Switch> outside a <Router>');
            const { locationStack, location, direction } = context;
            let lastLocation = this.lastLocation;
            if (lastLocation && lastLocation.key === location.key) {
                lastLocation = null;
            }
            if (!this.lastLocation || this.lastLocation.key !== location.key) {
                this.lastLocation = location;
            }
            const routes = [];
            React.Children.forEach(this.props.children, (child) => {
                if (React.isValidElement(child)) {
                    routes.push(child);
                }
            });
            let children = [];
            let { route: activeRoute, match } = getLocationRoute(location, routes);
            if (!activeRoute) {
                console.error('No route found for location', location);
                return null;
            }
            if (activeRoute.type === Redirect_1.default && location.key !== context.globalLocation.key) {
                activeRoute = null;
            }
            if (activeRoute) {
                let matcher = Object.assign({}, activeRoute.props, { path: activeRoute.props.path || '/' });
                let childLoactionList = locationStack.filter((loc) => matchPath_1.default(loc.pathname, matcher));
                children.push(React.cloneElement(activeRoute, {
                    key: location.key,
                    active: true,
                    lastLocation,
                    location,
                    locationStack: childLoactionList,
                    computedMatch: match
                }));
                if (activeRoute.props.historyLimit && childLoactionList.length > activeRoute.props.historyLimit) {
                    let needFree = [];
                    let startIndex = locationStack.indexOf(childLoactionList[0]);
                    let endIndex = locationStack.indexOf(childLoactionList[childLoactionList.length - activeRoute.props.historyLimit]);
                    for (let i = startIndex; i < endIndex; i += 1) {
                        needFree.push(locationStack[i].key);
                    }
                    if (needFree.length) {
                        window.setTimeout(() => context.freeLocations(needFree));
                    }
                }
            }
            if (animation.type && lastLocation && this.animationLock !== location.key) {
                let { route: lastRoute, match } = getLocationRoute(lastLocation, routes);
                if (lastRoute) {
                    let matcher = Object.assign({}, lastRoute.props, { path: lastRoute.props.path || '/' });
                    let childLoactionList = locationStack.filter((loc) => matchPath_1.default(loc.pathname, matcher));
                    children.push(React.cloneElement(lastRoute, {
                        key: lastLocation.key,
                        last: true,
                        lastLocation: null,
                        location: lastLocation,
                        locationStack: childLoactionList,
                        computedMatch: match
                    }));
                    this.animationLock = location.key;
                    if (this.clear) {
                        this.clear();
                    }
                    this.clear = Runner(this, duration);
                }
            }
            return (React.createElement("div", { ref: this.handleRef, className: classnames('s-component s-router-switch', {
                    's-animation': animation.type,
                    's-vertical': animation.type && animation.direction === 'vertical',
                    's-horizontal': animation.type && animation.direction !== 'vertical',
                    's-forward': animation.type && direction === 'forward',
                    's-backward': animation.type && direction === 'backward',
                    's-start': animation.type,
                    [`s-duration-${duration}`]: animation.type,
                    [`s-${animation.type}`]: animation.type,
                }) }, children));
        }));
    }
}
exports.default = Switch;
