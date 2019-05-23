import * as React from 'react';
import * as H from 'history';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { Animation } from '@samoyed/types';
import RouterContext from './RouterContext';
import Redirect from './Redirect';
import matchPath from './matchPath';
import { SwitchProps, Match, RouteProps } from '.';

interface RouteEntry {
  entry: H.Location;
  index: number;
  match: Match<any>;
}

interface RouteWithEntries {
  route: React.ReactElement<RouteProps>;
  entries: RouteEntry[];
}

interface EntryWithRoute {
  entry: H.Location;
  route?: React.ReactElement<RouteProps>;
  routeIndex: number;
  match?: Match<any>;
}

export default class Switch extends React.Component<SwitchProps> {
  animation?: Animation;
  animationLock?: string;
  animationTimer?: number;
  animationAction?: 'forward' | 'backward';
  animationStage?: 'start' | 'active' | 'done';
  last?: H.Location;
  elRef?: HTMLElement;

  handleRef = (ref: HTMLElement) => {
    this.elRef = ref;
  };

  updateAnimation = () => {
    if (!this.elRef) return;
    let classList = new Set(Array.from(this.elRef.classList));
    if (this.animationStage === 'start') {
      this.animationStage = 'active';
      this.animationTimer = window.setTimeout(this.updateAnimation, this.animation.duration || app.defaults.switchAnimationDuration);
      classList.delete('s-done');
      classList.delete('s-start');
      classList.add('s-active');
    } else if (this.animationStage === 'active') {
      this.animationStage = 'done';
      classList.delete('s-start');
      classList.delete('s-active');
      classList.add('s-done');
    }
    this.elRef.className = Array.from(classList).join(' ');
    if (this.animationStage === 'done' && this.last) {
      this.forceUpdate();
    }
  };

  render() {
    // @ts-ignore
    let animation: Animation = this.props.animation || {};
    if (typeof animation === 'string') {
      animation = { type: animation };
    }
    this.animation = animation;
    const duration = this.animation.duration || app.defaults.switchAnimationDuration;
    return (
      <RouterContext.Consumer>
        {(context) => {
          if (!context || !context.history) throw new Error('You should not use <Switch> outside a <Router>');

          // console.error('------------ refresh ---------------', context);
          const routesWithEntries: RouteWithEntries[] = [];
          const entriesWithRoute: EntryWithRoute[] = [];
          const entriesKeys: H.LocationKey[] = [];
          const needFree: H.LocationKey[] = [];
          const routes: React.ReactElement<RouteProps>[] = [];

          function getEntryRoute(entry: H.Location): EntryWithRoute {
            // eslint-disable-next-line guard-for-in
            for (let i in routes) {
              let route = routes[i];
              // @ts-ignore
              const path = route.props.path || route.props.from || '/';
              let match = matchPath(entry.pathname, { ...route.props, path });
              if (match) {
                return { entry, route, routeIndex: Number(i), match };
              }
            }
            return { entry, routeIndex: -1 };
          }

          React.Children.forEach(this.props.children, (child) => {
            if (React.isValidElement(child)) {
              routes.push(child);
            }
          });

          routes.forEach((child: React.ReactElement<RouteProps>) => {
            let routeEntries: RouteEntry[] = [];
            context.entries.forEach((entry, index) => {
              // @ts-ignore
              const path = child.props.path || child.props.from || '/';
              let match = matchPath(entry.pathname, { ...child.props, path });
              if (match) {
                routeEntries.push({ entry, index, match });
              }
            });
            routesWithEntries.push({ route: child, entries: routeEntries });
          });


          context.entries.forEach((entry) => {
            entriesKeys.push(entry.key);
            entriesWithRoute.push(getEntryRoute(entry));
          });

          routesWithEntries.forEach(({ route, entries }) => {
            if (route.props.historyLimit && entries.length > route.props.historyLimit) {
              let startIndex = entries[0].index;
              let endIndex = entries[entries.length - route.props.historyLimit].index;
              for (let i = startIndex; i < endIndex; i++) {
                let key = context.entries[i].key;
                if (needFree.indexOf(key) === -1) {
                  needFree.push(key);
                }
              }
            }
          });

          // console.warn({ routesWithEntries, entriesWithRoute, needFree });

          if (needFree.length) {
            window.setTimeout(() => context.freeEntries(needFree));
          }

          let children: React.ReactElement[] = [];

          let item = entriesWithRoute[entriesWithRoute.length - 1];
          // console.log('item', item);
          let route = item.route;
          if (route.type === Redirect && item.entry.key !== context.globalLocation.key) {
            // Redirect
            route = null;
          }
          if (route) {
            // console.warn('active', item);
            children.push(React.cloneElement(item.route, {
              key: 'active',
              active: true,
              location: item.entry,
              entries: (routesWithEntries[item.routeIndex]).entries.map((e) => e.entry),
            }));
          }

          if (animation.type) {
            const last = context.last;
            let previousEntryRoute = entriesWithRoute[entriesWithRoute.length - 2];
            if (previousEntryRoute && previousEntryRoute.route) {
              // console.warn('previous', previousEntryRoute);
              children.push(React.cloneElement(previousEntryRoute.route, {
                key: 'previous',
                previous: true,
                last: last && last.key === previousEntryRoute.entry.key,
                location: previousEntryRoute.entry,
                entries: (routesWithEntries[previousEntryRoute.routeIndex]).entries.map((e) => e.entry),
              }));
            }

            this.last = null;

            // 激活当前动画
            if (this.animationLock !== item.entry.key) {
              this.animationLock = item.entry.key;
              if (last && entriesKeys.indexOf(last.key) === -1) {
                let lastEntryRoute = getEntryRoute(last);
                this.animationAction = 'backward';
                if (lastEntryRoute.route) {
                  this.last = lastEntryRoute.entry;
                  // console.warn('last', lastEntryRoute);
                  children.push(React.cloneElement(lastEntryRoute.route, {
                    key: 'last',
                    last: true,
                    location: lastEntryRoute.entry,
                    entries: (routesWithEntries[lastEntryRoute.routeIndex]).entries.map((e) => e.entry),
                  }));
                }
              }

              this.animationStage = 'start';
              this.animationAction = context.action === 'POP' ? 'backward' : 'forward';
              if (this.animationTimer) clearTimeout(this.animationTimer);
              this.animationTimer = window.setTimeout(this.updateAnimation);
              if (this.elRef) {
                let classList = new Set(Array.from(this.elRef.classList));
                classList.add('s-start');
                classList.delete('s-active');
                classList.delete('s-done');
                this.elRef.className = Array.from(classList).join(' ');
              }
            }
          }

          return (
            <div
              ref={this.handleRef}
              className={classnames('s-component s-router-switch', {
                's-animation': animation.type,
                's-vertical': animation.type && animation.direction === 'vertical',
                's-horizontal': animation.type && animation.direction !== 'vertical',
                's-forward': animation.type && this.animationAction === 'forward',
                's-backward': animation.type && this.animationAction === 'backward',
                [`s-duration-${duration}`]: animation.type,
                [`s-${animation.type}`]: animation.type,
                's-start': animation.type && this.animationStage === 'start'
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
