import * as React from 'react';
import * as H from 'history';
import { History, Location } from '@samoyed/history';

export type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface Match<Params extends { [K in keyof Params]?: string } = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouterChildContext<Params extends { [K in keyof Params]?: string } = {}> {
  history: History;
  location: Location;
  match: Match<Params>;
}

export interface RouteChildrenProps<Params extends { [K in keyof Params]?: string } = {}, S = H.LocationState> {
  history: History;
  location: Location<S>;
  match: Match<Params>;
}

export interface RouteComponentProps<Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext, S = H.LocationState> {
  history: H.History;
  location: H.Location<S>;
  match: Match<Params>;
  staticContext?: C;
}

export interface StaticContext {
  statusCode?: number;
}

export interface StaticRouterContext extends StaticContext {
  url?: string;
  action?: 'PUSH' | 'REPLACE';
  location?: Location;
}

export interface RouterProps {
  history: History;
  staticContext?: StaticContext;
}

export class Router extends React.Component<RouterProps> {
}

export interface StaticRouterProps {
  basename?: string;
  location?: string | object;
  context?: StaticRouterContext;
}

export class StaticRouter extends React.Component<StaticRouterProps> {
}

export interface RouteProps {
  location?: Location;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  render?: ((props: RouteComponentProps<any>) => React.ReactNode);
  children?: ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode;
  // TODO: string | string[]
  path?: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  computedMatch?: Match<any>;
}

export class Route extends React.Component<RouteProps> {
}

export interface LinkProps {
}

export class Link extends React.Component<LinkProps> {
}

export interface NavLinkProps {
}

export class NavLink extends React.Component<NavLinkProps> {
}

export interface PromptProps {
}

export class Prompt extends React.Component<PromptProps> {
}

export interface RedirectProps {
}

export class Redirect extends React.Component<RedirectProps> {
}

export interface SwitchProps {
  location?: Location;
}

export class Switch extends React.Component<SwitchProps> {
}

export interface RouterContext extends React.Context<RouterChildContext> { }

export function matchPath<Params extends { [K in keyof Params]?: string }>(pathname: string, props: string | RouteProps, parent?: Match<Params> | null): Match<Params> | null;

export function generatePath(pattern: string, params?: { [paramName: string]: string | number | boolean | undefined }): string;

export function withRouter<P extends RouteComponentProps<any>>(component: React.ComponentType<P>): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>>>;
