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
            if (this._isMounted) {
                let entries = this.state.entries;
                let type = 'PUSH';
                if (action === 'REPLACE') {
                    type = 'REPLACE';
                }
                else if (entries.length > 1 && action === 'POP') {
                    if (history.length < 50) {
                        if (history.length === this.state.length) {
                            type = 'POP';
                        }
                    }
                    else if (entries[entries.length - 2].pathname === location.pathname) {
                        type = 'POP';
                    }
                }
                if (type === 'POP') {
                    entries.pop();
                }
                else if (type === 'PUSH') {
                    entries = entries.concat(location);
                }
                else {
                    entries[entries.length - 1] = location;
                }
                this.setState({
                    action: type,
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
            entries = entries.filter((entry) => keys.indexOf(entry.key) === -1);
            console.log('after free', ...entries);
            this.setState({ entries });
        };
        let history = props.history;
        let location = history.location;
        if (!location.key) {
            location.key = random();
        }
        this.state = {
            action: 'PUSH',
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
            this.setState({ location: this._pendingLocation, entries: [this._pendingLocation] });
        }
    }
    componentWillUnmount() {
        if (this.unlisten)
            this.unlisten();
    }
    render() {
        return (React.createElement(RouterContext_1.default.Provider, { value: {
                action: this.state.action,
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
