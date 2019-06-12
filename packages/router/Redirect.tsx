import * as React from 'react';
import { createLocation, locationsAreEqual } from 'history';
import RouterContext from './RouterContext';
import Lifecycle from './Lifecycle';
import generatePath from './generatePath';
import { RedirectProps, RouterChildContext } from '.';

export default function Redirect({ computedMatch, to, push = false }: RedirectProps) {
  return (
    <RouterContext.Consumer>
      {(context: RouterChildContext) => {
        if (!context || !context.history) throw new Error('You should not use <Redirect> outside a <Router>');

        const { history, staticContext } = context;

        const method = push ? history.push : history.replace;
        const location = createLocation(computedMatch
          ? typeof to === 'string'
            ? generatePath(to, computedMatch.params)
            : {
              ...to,
              pathname: generatePath(to.pathname, computedMatch.params)
            }
          : to);

        // When rendering in a static context,
        // set the new location immediately.
        if (staticContext) {
          method(location);
          return null;
        }

        return (
          <Lifecycle
            onMount={() => {
              method(location);
            }}
            onUpdate={(self, prevProps) => {
              const prevLocation = createLocation(prevProps.to);
              if (
                !locationsAreEqual(prevLocation, {
                  ...location,
                  key: prevLocation.key
                })
              ) {
                method(location);
              }
            }}
            to={to}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}
