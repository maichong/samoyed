import * as React from 'react';
import RouterContext from './RouterContext';
import samoyedHistory, { Location } from '@samoyed/history';
import { RouterProps } from '.';


function computeRootMatch(pathname: string) {
  return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}

interface State {
  location: Location;
}

export default class Router extends React.Component<RouterProps, State> {
  _isMounted: boolean;
  _pendingLocation: Location;
  unlisten: () => void;

  constructor(props: RouterProps) {
    super(props);

    let history = props.history || samoyedHistory;

    this.state = {
      location: history.location
    };

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
    this._isMounted = false;
    this._pendingLocation = null;

    if (!props.staticContext) {
      this.unlisten = history.listen((location) => {
        if (this._isMounted) {
          this.setState({ location });
        } else {
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
    if (this.unlisten) this.unlisten();
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history || samoyedHistory,
          location: this.state.location,
          match: computeRootMatch(this.state.location.pathname)
        }}
      >{this.props.children || null}</RouterContext.Provider>
    );
  }
}
