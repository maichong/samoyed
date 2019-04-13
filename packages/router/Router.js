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
class Router extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (location, action) => {
            const { history } = this.props;
            if (!location.key) {
                location.key = random();
            }
            console.log(action, history.length, location);
            if (this._isMounted) {
                let entries = this.state.entries;
                if (entries.length > 1 && action === 'POP' && entries[entries.length - 2].key === location.key) {
                    entries.pop();
                }
                else {
                    entries = entries.concat(location);
                }
                console.log(...entries);
                this.setState({
                    length: history.length,
                    entries,
                    location,
                    last: this.state.location
                });
            }
            else {
                this._pendingLocation = location;
            }
        };
        this.freeEntries = (list) => {
            let { entries } = this.state;
            let keys = list.map((entry) => (typeof entry === 'string' ? entry : entry.key));
            entries = entries.filter((entry) => keys.indexOf(entry.key) > -1);
            this.setState({ entries });
        };
        let history = props.history;
        let location = history.location;
        if (!location.key) {
            location.key = random();
        }
        this.state = {
            length: history.length,
            location,
            entries: [location],
            last: null
        };
        window.h = history;
        this._isMounted = false;
        this._pendingLocation = null;
        if (!props.staticContext) {
            this.unlisten = history.listen(this.handleChange);
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
                freeEntries: this.freeEntries,
                history: this.props.history,
                globalEntries: this.state.entries,
                globalLast: this.state.last,
                globalLocation: this.state.location,
                entries: this.state.entries,
                last: this.state.last,
                location: this.state.location,
                match: computeRootMatch(this.state.location.pathname)
            } }, this.props.children || null));
    }
}
exports.default = Router;
