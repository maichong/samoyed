import * as React from 'react';
import * as H from 'history';
import RouterContext from './RouterContext';
import { LinkProps } from '.';

function isModifiedEvent(event: any) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default function Link(props: LinkProps) {
  const { innerRef, replace, to, onClick, ...rest } = props; // eslint-disable-line no-unused-vars
  let context = React.useContext(RouterContext);
  if (!context || !context.history) throw new Error('You should not use <Link> outside a <Router>');

  const location =
    typeof to === 'string'
      ? H.createLocation(to, null, null, context.location)
      : to;
  const href = location ? context.history.createHref(location) : '';

  const handleClick = (event: any) => {
    if (onClick) onClick(event);

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!props.target || props.target === '_self') && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const method = replace ? context.history.replace : context.history.push;

      // @ts-ignore
      method(to);
    }
  };

  return (
    <a
      {...rest}
      onClick={handleClick}
      href={href}
      ref={innerRef}
    />
  );
}
