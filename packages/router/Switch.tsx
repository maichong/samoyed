import * as React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
import { SwitchProps, Match } from '.';

export default class Switch extends React.Component<SwitchProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          const location = this.props.location || context.location;

          let match: Match = null;
          let element;

          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, (child) => {
            if (match == null && React.isValidElement(child)) {
              element = child;

              // @ts-ignore
              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
