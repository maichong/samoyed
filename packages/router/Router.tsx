import * as React from 'react';
import * as H from 'history';
import RouterContext from './RouterContext';
import { RouterProps, RouterDirection } from '.';

function random() {
  return Math.random().toString().substr(2);
}

function computeRootMatch(pathname: string) {
  return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
}

function isLocationEq(a: H.Location, b: H.Location) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
}

interface State {
  direction: 'replace' | 'backward' | 'forward';
  index: number;
  allLocationList: H.Location[];
  locationStack: H.Location[];
  location: H.Location;
  lastLocation?: H.Location;
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
      direction: 'replace',
      index: 0,
      allLocationList: [location],
      location,
      locationStack: [location],
      lastLocation: null
    };

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
      this.setState({
        location: this._pendingLocation,
        locationStack: [this._pendingLocation],
        allLocationList: [this._pendingLocation],
      });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }

  handleChange = (location: H.Location, action: H.Action) => {
    if (!location.key) {
      location.key = random();
    }

    if (!this._isMounted) {
      this._pendingLocation = location;
      return;
    }

    const { history } = this.props;
    // console.log(action, location.key, location, history.length);

    let locationStack = this.state.locationStack;
    let { allLocationList, index, location: lastLocation } = this.state;
    let direction: RouterDirection;

    if (action === 'REPLACE') {
      direction = 'replace';
      allLocationList[index] = location;
      allLocationList.splice(index, 1000, location);
    } else if (action === 'PUSH') {
      direction = 'forward';
      allLocationList.push(location);
      index = allLocationList.length - 1;
      locationStack = locationStack.concat(location);
    } else {
      // POP
      // 检查是不是 返回事件
      let previous = locationStack[locationStack.length - 2];
      if (previous && isLocationEq(previous, location)) {
        direction = 'backward';
        index -= 1;
        locationStack.pop();
        location = locationStack[locationStack.length - 1];
        history.location = location;
      }

      // 检查是不是 前进事件
      let next = allLocationList[index + 1];
      if (!direction && next && isLocationEq(next, location)) {
        direction = 'forward';
        index += 1;
        locationStack.push(next);
        location = next;
        history.location = location;
      }

      // 检查是不是 go(-n)
      if (!direction && index >= 1) {
        for (let i = index - 1; i >= 0; i -= 1) {
          let loc = allLocationList[i];
          if (isLocationEq(loc, location)) {
            direction = 'backward';
            index = i;
            let stackIndex = locationStack.indexOf(loc);
            if (stackIndex > -1) {
              // 在stack中
              locationStack.splice(stackIndex + 1);
            } else {
              // 不在stack中，说明已经被回收
              if (locationStack.length > 1) {
                // TODO: 计算真正需要退回的数量
                locationStack.pop();
                location = locationStack[locationStack.length - 1];
                history.location = location;
              } else {
                // 已是初始页
                return;
              }
            }
            break;
          }
        }
      }

      if (!direction) {
        // 默认为 跳转新地址
        direction = 'forward';
        locationStack.splice(index + 1, 1000, location);
        locationStack = locationStack.concat(location);
      }
    }

    // console.log('after', direction, ...locationStack);
    // console.log('location', location);
    this.setState({
      direction,
      index,
      locationStack,
      location,
      lastLocation
    });
  };

  freeLocations = (keys: Array<H.LocationKey>) => {
    let { locationStack } = this.state;
    locationStack = locationStack.filter((loc) => keys.indexOf(loc.key) === -1);
    this.setState({ locationStack });
    // console.log('after free locations', locationStack);
  };

  render() {
    return (
      <RouterContext.Provider
        value={{
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
        }}
      >{this.props.children || null}</RouterContext.Provider>
    );
  }
}
