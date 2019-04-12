"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
function computeRootMatch(pathname) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}
class Router extends React.Component {
    constructor(props) {
        super(props);
        let history = props.history;
        this.state = {
            location: history.location,
            entries: [history.location]
        };
        this._isMounted = false;
        this._pendingLocation = null;
        if (!props.staticContext) {
            this.unlisten = history.listen((location) => {
                if (this._isMounted) {
                    this.setState({ location });
                }
                else {
                    this._pendingLocation = location;
                }
            });
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this._pendingLocation) {
            this.setState({ location: this._pendingLocation });
        }
    }
    componentWillUnmount() {
        if (this.unlisten)
            this.unlisten();
    }
    render() {
        return (React.createElement(RouterContext_1.default.Provider, { value: {
                globalLocation: this.state.location,
                allEntries: this.state.entries,
                entries: this.state.entries,
                history: this.props.history,
                location: this.state.location,
                match: computeRootMatch(this.state.location.pathname)
            } }, this.props.children || null));
    }
}
exports.default = Router;
