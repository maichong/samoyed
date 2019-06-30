import * as React from 'react';
import * as hoistStatics from 'hoist-non-react-statics';
import RouterContext from './RouterContext';
import { RouteComponentProps } from '.';

export default function withRouter<P extends RouteComponentProps<any>>(Component: React.ComponentType<P>) {
  const context = React.useContext(RouterContext);
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  const C = (props: any) => {
    const { wrappedComponentRef, ...remainingProps } = props;

    if (!context || !context.history) throw new Error('You should not use <withRouter> outside a <Router>');

    return (
      <Component
        {...remainingProps}
        {...context}
        ref={wrappedComponentRef}
      />
    );
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
}
