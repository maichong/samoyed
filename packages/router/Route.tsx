import * as React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
import { RouteProps, RouterChildContext, RouteComponentProps } from '.';

function isEmptyChildren(children: any) {
  return React.Children.count(children) === 0;
}

export default class Route extends React.Component<RouteProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {

          let { children, component, render, entries, last, previous, active } = this.props;
          const location = this.props.location || context.location;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }

          const match = this.props.computedMatch || (this.props.path ? matchPath(location.pathname, this.props) : context.match);

          const childContext: RouterChildContext = {
            ...context,
            location,
            match,
            entries: entries || context.entries
          };
          const childProps: RouteComponentProps = {
            history: context.history,
            location,
            match,
            active,
            last,
            previous
          };

          if (typeof children === 'function') {
            // @ts-ignore
            children = children(childProps);

            if (typeof children === 'undefined') {
              children = null;
            }
          }

          return (
            <RouterContext.Provider value={childContext}>
              {children && !isEmptyChildren(children)
                ? children
                : childContext.match
                  ? component
                    ? React.createElement(component, childProps)
                    : render
                      ? render(childProps)
                      : null
                  : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
