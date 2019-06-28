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

/**
 * Route 给所调用的组件注如的Props
 * 即，各个页面组件会额外获得的Props
 */
export interface RouteComponentProps<Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext, S = H.LocationState> {
  history: H.History;
  location: H.Location<S>;
  match: Match<Params>;
  staticContext?: C;
  /**
   * 路由信息
   */
  router: RouterChildContext<Params, S>;
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
  /**
   * History 历史栈中，当前Route最多保存多少个副本，默认不限
   * 如果超过此值，则采用区间回收，比如Route A限制为2，路由跳转关系为
   * A1 -> B1 -> A2 -> C1 -> A3
   * 当载入A3时，Route A的副本数大于2，则 A1、B1 将被销毁，最后，历史栈变为
   * A2 -> C1 -> A3
   */
  historyLimit?: number;
  entries?: H.Location[];
  /**
   * @private
   */
  previous?: boolean;
  /**
   * @private
   */
  last?: boolean;
  /**
   * @private
   */
  active?: boolean;
  /**
   * @private
   */
  computedMatch?: Match<any>;
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
  location?: H.Location;
  isActive?<Params extends { [K in keyof Params]?: string }>(match: Match<Params>, location: H.Location): boolean;
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

declare const RouterContext: React.Context<RouterChildContext>;

export { RouterContext };

export function matchPath<Params extends { [K in keyof Params]?: string }>(pathname: string, props: string | RouteProps, parent?: Match<Params> | null): Match<Params> | null;

export function generatePath(pattern: string, params?: { [paramName: string]: string | number | boolean | undefined }): string;

export function withRouter<P extends RouteComponentProps<any>>(component: React.ComponentType<P>): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>>>;
