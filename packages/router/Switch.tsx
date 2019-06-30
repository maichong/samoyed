import * as React from 'react';
import * as H from 'history';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { Animation } from '@samoyed/types';
import RouterContext from './RouterContext';
import Redirect from './Redirect';
import matchPath from './matchPath';
import { SwitchProps, RouteProps, RouterChildContext } from '.';

interface LocationRoute {
  route?: React.ReactElement<RouteProps>;
  match?: any;
}
function getLocationRoute(location: H.Location, routes: React.ReactElement<RouteProps>[]): LocationRoute {
  // eslint-disable-next-line guard-for-in
  for (let i in routes) {
    let route = routes[i];
    // @ts-ignore
    const path = route.props.path || route.props.from || '/';
    let match = matchPath(location.pathname, { ...route.props, path });
    if (match) {
      return { route, match };
    }
  }
  return {};
}

function Runner(obj: Switch, duration: number) {
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
  let timer: any = setTimeout(() => {
    stage = 'running';
    updateStage();
    updateStage();
    timer = setTimeout(() => {
      stage = 'done';
      updateStage();
      timer = 0;
    }, duration || app.defaults.animationDuration);
  });
  return function clearup() {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

export default class Switch extends React.Component<SwitchProps> {
  clear: Function;
  animationLock?: string;
  lastLocation?: H.Location;
  elRef?: HTMLElement;

  componentWillUnmount() {
    if (this.clear) {
      this.clear();
      this.clear = null;
    }
  }

  handleRef = (ref: HTMLElement) => {
    this.elRef = ref;
  };

  render() {
    // @ts-ignore
    let animation: Animation = this.props.animation || {};
    if (typeof animation === 'string') {
      animation = { type: animation };
    }
    const duration = animation.duration || app.defaults.switchAnimationDuration;
    return (
      <RouterContext.Consumer>
        {(context: RouterChildContext) => {
          if (!context || !context.history) throw new Error('You should not use <Switch> outside a <Router>');
          const { locationStack, location, direction } = context;

          let lastLocation = this.lastLocation;
          if (lastLocation && lastLocation.key === location.key) {
            lastLocation = null;
          }
          if (!this.lastLocation || this.lastLocation.key !== location.key) {
            this.lastLocation = location;
          }

          const routes: React.ReactElement<RouteProps>[] = [];

          React.Children.forEach(this.props.children, (child) => {
            if (React.isValidElement(child)) {
              routes.push(child);
            }
          });

          let children: React.ReactElement[] = [];

          // 根据location，匹配Route
          let { route: activeRoute, match } = getLocationRoute(location, routes);
          if (!activeRoute) {
            // 当前路由表中，匹配location失败
            console.error('No route found for location', location);
            return null;
          }

          if (activeRoute.type === Redirect && location.key !== context.globalLocation.key) {
            // 如果当前的位置不是全局位置，则匹配的 Redirect 无效，不能跳转，否则会有bug
            activeRoute = null;
          }
          if (activeRoute) {
            let matcher = { ...activeRoute.props, path: activeRoute.props.path || '/' };
            let childLoactionList = locationStack.filter((loc) => matchPath(loc.pathname, matcher));
            children.push(React.cloneElement(activeRoute, {
              key: location.key,
              active: true,
              lastLocation,
              location,
              locationStack: childLoactionList,
              computedMatch: match
            }));

            // 如果当前Route设置了历史记录数量限制，自动区间回收不需要的历史记录
            if (activeRoute.props.historyLimit && childLoactionList.length > activeRoute.props.historyLimit) {
              let needFree: string[] = [];
              let startIndex = locationStack.indexOf(childLoactionList[0]);
              let endIndex = locationStack.indexOf(childLoactionList[childLoactionList.length - activeRoute.props.historyLimit]);
              for (let i = startIndex; i < endIndex; i += 1) {
                needFree.push(locationStack[i].key);
              }

              // 异步回收locations历史记录
              if (needFree.length) {
                window.setTimeout(() => context.freeLocations(needFree));
              }
            }
          }

          if (animation.type && lastLocation && this.animationLock !== location.key) {
            let { route: lastRoute, match } = getLocationRoute(lastLocation, routes);
            if (lastRoute) {
              let matcher = { ...lastRoute.props, path: lastRoute.props.path || '/' };
              let childLoactionList = locationStack.filter((loc) => matchPath(loc.pathname, matcher));
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

          return (
            <div
              ref={this.handleRef}
              className={classnames('s-component s-router-switch', {
                's-animation': animation.type,
                's-vertical': animation.type && animation.direction === 'vertical',
                's-horizontal': animation.type && animation.direction !== 'vertical',
                's-forward': animation.type && direction === 'forward',
                's-backward': animation.type && direction === 'backward',
                's-start': animation.type,
                [`s-duration-${duration}`]: animation.type,
                [`s-${animation.type}`]: animation.type,
              })}
            >
              {children}
            </div>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
