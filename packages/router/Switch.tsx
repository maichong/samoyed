import * as React from 'react';
import Box from '@samoyed/box';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
import { SwitchProps, Match } from '.';

export default class Switch extends React.Component<SwitchProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          const location = context.location;

          let match: Match = null;
          let element;

          let array: React.ReactNode[] = [];
          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
              // element = child;

              // @ts-ignore
              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;

              if (match) {
                // @ts-ignore
                array.push(React.cloneElement(child, { location, key: child.key || index }));
              }
            }
          });

          return (
            <Box className="s-router-switch" layout="card">
              {array}
            </Box>
          );

          // return match
          //   ? React.cloneElement(element, { location, computedMatch: match })
          //   : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
