import * as React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';
import { RouteProps, RouterChildContext, RouteComponentProps } from '.';

function isEmptyChildren(children: any) {
  return React.Children.count(children) === 0;
}

export default function Route(props: RouteProps) {
  let { children, component, render, locationStack, lastLocation, last, active } = props;
  let context = React.useContext(RouterContext);
  const location = props.location || context.location;

  // Preact uses an empty array as children by
  // default, so use null if that's the case.
  if (Array.isArray(children) && children.length === 0) {
    children = null;
  }

  const match = props.computedMatch || (props.path ? matchPath(location.pathname, props) : context.match);

  const childContext: RouterChildContext = {
    ...context,
    location,
    match,
    locationStack: locationStack || context.locationStack,
    lastLocation: lastLocation || context.lastLocation,
  };
  const childProps: RouteComponentProps = {
    history: context.history,
    location,
    match,
    active,
    last,
    router: childContext
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
}
