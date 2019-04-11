import * as React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
import { RouteProps } from '.';

function isEmptyChildren(children: any) {
  return React.Children.count(children) === 0;
}

export default class Route extends React.Component<RouteProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
              ? matchPath(location.pathname, this.props)
              : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }

          if (typeof children === 'function') {
            // @ts-ignore
            children = children(props);

            if (typeof children === 'undefined') {
              children = null;
            }
          }

          return (
            <RouterContext.Provider value={props}>
              {children && !isEmptyChildren(children)
                ? children
                : props.match
                  ? component
                    ? React.createElement(component, props)
                    : render
                      ? render(props)
                      : null
                  : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
