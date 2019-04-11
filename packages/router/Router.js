"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RouterContext_1 = require("./RouterContext");
const history_1 = require("@samoyed/history");
function computeRootMatch(pathname) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}
class Router extends React.Component {
    constructor(props) {
        super(props);
        let history = props.history || history_1.default;
        this.state = {
            location: history.location
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
                history: this.props.history || history_1.default,
                location: this.state.location,
                match: computeRootMatch(this.state.location.pathname)
            } }, this.props.children || null));
    }
}
exports.default = Router;
