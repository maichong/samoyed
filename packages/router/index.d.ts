import * as React from 'react';
import * as H from 'history';
import { Animation, AnimationType } from '@samoyed/types';

export type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface Match<Params extends { [K in keyof Params]?: string } = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouterChildContext<Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext> {
  freeEntries: (list: Array<H.Location | H.LocationKey>) => void;
  action: H.Action;
  history: H.History;
  globalEntries: H.Location[];
  globalLast?: H.Location;
  globalLocation: H.Location;
  entries: H.Location[];
  last?: H.Location;
  location: H.Location;
  match: Match<Params>;
  staticContext?: C;
}

// export interface RouteChildrenProps<Params extends { [K in keyof Params]?: string } = {}, S = H.LocationState> {
//   history: H.History;
//   location: H.Location<S>;
//   match: Match<Params>;
//   previous?: boolean;
//   last?: boolean;
//   active?: boolean;
// }

export interface RouteComponentProps<Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext, S = H.LocationState> {
  history: H.History;
  location: H.Location<S>;
  match: Match<Params>;
  staticContext?: C;
  previous?: boolean;
  last?: boolean;
  active?: boolean;
}

export interface StaticContext {
  statusCode?: number;
}

export interface StaticRouterContext extends StaticContext {
  url?: string;
  action?: 'PUSH' | 'REPLACE';
  location?: H.Location;
}

export interface RouterProps {
  history: H.History;
  staticContext?: StaticContext;
  /**
   * 默认的组件回收策略
   * immediate 当Route切换后，立即回收组件
   * animation 当Route切换后，并且过度动画执行结束后，销毁组件
   * keepalive 不自动回收组件，除非 history entry 被回收，或Route组件Props中单独设置其他回收策略
   */
  freeComponent?: 'immediate' | 'animation' | 'keepalive';
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
  location?: H.Location;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  render?: ((props: RouteComponentProps<any>) => React.ReactNode);
  children?: ((props: RouteComponentProps<any>) => React.ReactNode) | React.ReactNode;
  // TODO: string | string[]
  path?: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  computedMatch?: Match<any>;
  /**
   * 默认的组件回收策略
   * immediate 当Route切换后，立即回收组件
   * animation 当Route切换后，并且过度动画执行结束后，销毁组件
   * keepalive 不自动回收组件，除非 history entry 被回收，或Route组件Props中单独设置其他回收策略
   */
  freeComponent?: 'immediate' | 'animation' | 'keepalive';
  historyLimit?: number;
  entries?: H.Location[];
  previous?: boolean;
  last?: boolean;
  active?: boolean;
}

export class Route extends React.Component<RouteProps> {
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: H.LocationDescriptor;
  replace?: boolean;
  innerRef?: (node: HTMLAnchorElement | null) => void;
}

export class Link extends React.Component<LinkProps> {
}

export interface NavLinkProps extends LinkProps {
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  exact?: boolean;
  strict?: boolean;
  isActive?<Params extends { [K in keyof Params]?: string }>(match: Match<Params>, location: H.Location): boolean;
  location?: H.Location;
}

export class NavLink extends React.Component<NavLinkProps> {
}

export interface PromptProps {
}

export class Prompt extends React.Component<PromptProps> {
}

export interface RedirectProps {
  to: H.LocationDescriptor;
  push?: boolean;
  from?: string;
  path?: string;
  exact?: boolean;
  strict?: boolean;
  computedMatch?: Match<any>;
}

export class Redirect extends React.Component<RedirectProps> {
}

export interface SwitchProps {
  animation?: AnimationType | Animation;
}

export class Switch extends React.Component<SwitchProps> {
}

export interface RouterContext extends React.Context<RouterChildContext> { }

export function matchPath<Params extends { [K in keyof Params]?: string }>(pathname: string, props: string | RouteProps, parent?: Match<Params> | null): Match<Params> | null;

export function generatePath(pattern: string, params?: { [paramName: string]: string | number | boolean | undefined }): string;

export function withRouter<P extends RouteComponentProps<any>>(component: React.ComponentType<P>): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>>>;
