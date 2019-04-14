import * as React from 'react';
import * as H from 'history';
import RouterContext from './RouterContext';
import { RouterProps } from '.';

function random() {
  return Math.random().toString().substr(2);
}

function computeRootMatch(pathname: string) {
  return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}

interface State {
  action: H.Action;
  entries: H.Location[];
  location: H.Location;
  last?: H.Location;
  length: number;
}

export default class Router extends React.Component<RouterProps, State> {
  _isMounted: boolean;
  _pendingLocation: H.Location;
  unlisten: () => void;

  constructor(props: RouterProps) {
    super(props);

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

    // @ts-ignore
    window.h = history;

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
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
    if (this.unlisten) this.unlisten();
  }

  handleChange = (location: H.Location, action: H.Action) => {
    const { history } = this.props;
    if (!location.key) {
      location.key = random();
    }
    // console.log(action, history.length, location, this._isMounted);
    if (this._isMounted) {
      let entries = this.state.entries;
      let type: H.Action = 'PUSH';
      if (action === 'REPLACE') {
        type = 'REPLACE';
      } else if (entries.length > 1 && action === 'POP') {
        if (history.length < 50) {
          if (history.length === this.state.length) {
            type = 'POP';
          }
        } else if (entries[entries.length - 2].pathname === location.pathname) {
          type = 'POP';
        }
      }
      if (type === 'POP') {
        entries.pop();
      } else if (type === 'PUSH') {
        entries = entries.concat(location);
      } else {
        // replace
        entries[entries.length - 1] = location;
      }
      // console.log(...entries);
      this.setState({
        action: type,
        length: history.length,
        entries,
        location,
        last: this.state.location
      });
    } else {
      this._pendingLocation = location;
    }
  };

  freeEntries = (list: Array<H.Location | H.LocationKey>) => {
    let { entries } = this.state;
    let keys: H.LocationKey[] = list.map((entry: H.Location | H.LocationKey) => (typeof entry === 'string' ? entry : entry.key));
    entries = entries.filter((entry) => keys.indexOf(entry.key) === -1);
    console.log('after free', ...entries);
    this.setState({ entries });
  };

  render() {
    return (
      <RouterContext.Provider
        value={{
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
        }}
      >{this.props.children || null}</RouterContext.Provider>
    );
  }
}
