import * as React from 'react';
import * as H from 'history';
import Box from '@samoyed/box';
import RouterContext from './RouterContext';
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
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          console.log('switch context', context);

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
              const path = route.props.path || route.props.from;
              let match = matchPath(entry.pathname, { ...route.props, path });
              if (match) {
                // @ts-ignore
                return { entry, route, routeIndex: i, match };
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
              const path = child.props.path || child.props.from;
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

          if (needFree.length) {
            setTimeout(() => context.freeEntries(needFree));
          }

          console.log({
            routesWithEntries,
            // entriesWithRoute,
            needFree
          });


          let item = entriesWithRoute[entriesWithRoute.length - 1];

          let children: React.ReactElement[] = [React.cloneElement(item.route, {
            key: item.route.key || 0,
            location: item.entry,
            entries: (routesWithEntries[item.routeIndex]).entries.map((e) => e.entry),
          })];

          const last = context.last;
          if (last) {
            let lastEntryRoute = getEntryRoute(last);
            if (lastEntryRoute.route) {
              children.push(React.cloneElement(lastEntryRoute.route, {
                key: lastEntryRoute.route.key || 1,
                location: lastEntryRoute.entry,
                entries: (routesWithEntries[lastEntryRoute.routeIndex]).entries.map((e) => e.entry),
              }));
            }
          }

          // routesWithEntries.forEach(({route, entries }, index) => {
          //   if (!entries.length) return;
          //   children.push(React.cloneElement(route, { entries, key: route.key || index }));
          // });

          // console.log('children', children);

          return (
            <Box className="s-router-switch">
              {children}
            </Box>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
