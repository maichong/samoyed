"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
function random() {
    return Math.random().toString().substr(2);
}
function computeRootMatch(pathname) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}
function isLocationEq(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
}
class Router extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (location, action) => {
            if (!location.key) {
                location.key = random();
            }
            if (!this._isMounted) {
                this._pendingLocation = location;
                return;
            }
            const { history } = this.props;
            let locationStack = this.state.locationStack;
            let { allLocationList, index, location: lastLocation } = this.state;
            let direction;
            if (action === 'REPLACE') {
                direction = 'replace';
                allLocationList[index] = location;
                allLocationList.splice(index, 1000, location);
            }
            else if (action === 'PUSH') {
                direction = 'forward';
                allLocationList.push(location);
                index = allLocationList.length - 1;
                locationStack = locationStack.concat(location);
            }
            else {
                let previous = locationStack[locationStack.length - 2];
                if (previous && isLocationEq(previous, location)) {
                    direction = 'backward';
                    index -= 1;
                    locationStack.pop();
                    location = locationStack[locationStack.length - 1];
                    history.location = location;
                }
                let next = allLocationList[index + 1];
                if (!direction && next && isLocationEq(next, location)) {
                    direction = 'forward';
                    index += 1;
                    locationStack.push(next);
                    location = next;
                    history.location = location;
                }
                if (!direction && index >= 1) {
                    for (let i = index - 1; i >= 0; i -= 1) {
                        let loc = allLocationList[i];
                        if (isLocationEq(loc, location)) {
                            direction = 'backward';
                            index = i;
                            let stackIndex = locationStack.indexOf(loc);
                            if (stackIndex > -1) {
                                locationStack.splice(stackIndex + 1);
                            }
                            else {
                                if (locationStack.length > 1) {
                                    locationStack.pop();
                                    location = locationStack[locationStack.length - 1];
                                    history.location = location;
                                }
                                else {
                                    return;
                                }
                            }
                            break;
                        }
                    }
                }
                if (!direction) {
                    direction = 'forward';
                    locationStack.splice(index + 1, 1000, location);
                    locationStack = locationStack.concat(location);
                }
            }
            this.setState({
                direction,
                index,
                locationStack,
                location,
                lastLocation
            });
        };
        this.freeLocations = (keys) => {
            let { locationStack } = this.state;
            locationStack = locationStack.filter((loc) => keys.indexOf(loc.key) === -1);
            this.setState({ locationStack });
        };
        let history = props.history;
        let location = history.location;
        if (!location.key) {
            location.key = random();
        }
        this.state = {
            direction: 'replace',
            index: 0,
            allLocationList: [location],
            location,
            locationStack: [location],
            lastLocation: null
        };
        this._isMounted = false;
        this._pendingLocation = null;
        if (!props.staticContext) {
            this.unlisten = history.listen(this.handleChange);
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this._pendingLocation) {
            this.setState({
                location: this._pendingLocation,
                locationStack: [this._pendingLocation],
                allLocationList: [this._pendingLocation],
            });
        }
    }
    componentWillUnmount() {
        if (this.unlisten)
            this.unlisten();
    }
    render() {
        return (React.createElement(RouterContext_1.default.Provider, { value: {
                direction: this.state.direction,
                freeLocations: this.freeLocations,
                history: this.props.history,
                globalLocationStack: this.state.locationStack,
                globalLastLocation: this.state.lastLocation,
                globalLocation: this.state.location,
                locationStack: this.state.locationStack,
                location: this.state.location,
                lastLocation: this.state.lastLocation,
                match: computeRootMatch(this.state.location.pathname)
            } }, this.props.children || null));
    }
}
exports.default = Router;
