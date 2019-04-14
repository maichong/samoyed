import * as React from 'react';
import * as H from 'history';
import RouterContext from './RouterContext';
import { LinkProps } from '.';

function isModifiedEvent(event: any) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * The public API for rendering a history-aware <a>.
 */
export default class Link extends React.Component<LinkProps> {
  handleClick(event: any, history: H.History) {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!this.props.target || this.props.target === '_self') && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const method = this.props.replace ? history.replace : history.push;

      // @ts-ignore
      method(this.props.to);
    }
  }

  render() {
    const { innerRef, replace, to, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <RouterContext.Consumer>
        {(context) => {
          if (!context || !context.history) throw new Error('You should not use <Link> outside a <Router>');

          const location =
            typeof to === 'string'
              ? H.createLocation(to, null, null, context.location)
              : to;
          const href = location ? context.history.createHref(location) : '';

          return (
            <a
              {...rest}
              onClick={(event) => this.handleClick(event, context.history)}
              href={href}
              ref={innerRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
