import * as React from 'react';
import * as H from 'history';
import { StaticRouterProps } from '.';
import Router from './Router';

function addLeadingSlash(path: string): string {
  return path.charAt(0) === '/' ? path : '/' + path;
}

function addBasename(basename: string, location: H.Location): H.Location {
  if (!basename) return location;

  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  };
}

function stripBasename(basename: string, location: H.Location): H.Location {
  if (!basename) return location;

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  };
}

function createURL(location: H.LocationDescriptorObject | string): H.Path {
  return typeof location === 'string' ? location : H.createPath(location);
}

function staticHandler(methodName: string) {
  return () => {
    console.error('You cannot %s with <StaticRouter>', methodName);
  };
}

function noop() { }

/**
 * The public top-level API for a 'static' <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */
export default class StaticRouter extends React.Component<StaticRouterProps> {
  navigateTo(location: string | H.LocationDescriptorObject, action: 'PUSH' | 'REPLACE') {
    const {
      basename = '',
      context = {}
    } = this.props;
    context.action = action;
    context.location = addBasename(basename, H.createLocation(location));
    context.url = createURL(context.location);
  }

  handlePush = (location: string | H.LocationDescriptorObject) => this.navigateTo(location, 'PUSH');
  handleReplace = (location: string | H.LocationDescriptorObject) => this.navigateTo(location, 'REPLACE');
  handleListen = () => noop;
  handleBlock = () => noop;

  render() {
    const { basename = '', context = {}, location = '/', ...rest } = this.props;

    const history: H.History = {
      length: 1,
      createHref: (path: H.LocationDescriptorObject) => addLeadingSlash(basename + createURL(path)),
      action: 'POP',
      location: stripBasename(basename, H.createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler('go'),
      goBack: staticHandler('goBack'),
      goForward: staticHandler('goForward'),
      listen: this.handleListen,
      block: this.handleBlock
    };

    return <Router {...rest} history={history} staticContext={context} />;
  }
}
