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

export type RouterDirection = 'replace' | 'backward' | 'forward';

export interface RouterChildContext<Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext> {
  /**
   * 释放位置列表
   */
  freeLocations: (list: Array<H.LocationKey>) => void;
  /**
   * 返回到指定页面
   */
  goBackTo: (path: string) => boolean;
  /**
   * 当前路由跳转方向
   */
  direction: RouterDirection;
  /**
   * 历史记录对象
   */
  history: H.History;
  /**
   * 全局位置列表
   */
  globalLocationStack: H.Location[];
  /**
   * 全局上个位置
   */
  globalLastLocation?: H.Location;
  /**
   * 全局当前位置
   */
  globalLocation: H.Location;
  /**
   * 位置列表，当有多级Switch情况下，locationStack中只保留当前Switch所管理的位置列表
   */
  locationStack: H.Location[];
  /**
   * 上个位置
   */
  lastLocation?: H.Location | null;
  /**
   * 当前位置，当有多级Switch情况下，location是当前Switch中所管理的位置，如果当前Switch是激活状态，则与globalLocation相同
   */
  location: H.Location;
  /**
   * 当前路由匹配参数
   */
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
  // /**
  //  * 浏览器无前进按钮，微信浏览器或手机App中，此项目
  //  */
  // noForwardButton?: boolean;
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
  /**
   * @private
   */
  locationStack?: H.Location[];
  /**
   * @private
   */
  lastLocation?: H.Location | null;
  /**
   * @private
   */
  location?: H.Location;
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
  path?: string;
  exact?: boolean;
  strict?: boolean;
  computedMatch?: Match<any>;
}

export class Redirect extends React.Component<RedirectProps> {
}

export interface SwitchProps {
  /**
   * 路由切换动画
   */
  animation?: AnimationType | Animation;
  /**
   * Tab切换模式
   */
  tabMode?: boolean;
}

export class Switch extends React.Component<SwitchProps> {
}

declare const RouterContext: React.Context<RouterChildContext>;

export { RouterContext };

export function matchPath<Params extends { [K in keyof Params]?: string }>(pathname: string, props: string | RouteProps, parent?: Match<Params> | null): Match<Params> | null;

export function generatePath(pattern: string, params?: { [paramName: string]: string | number | boolean | undefined }): string;

export function withRouter<P extends RouteComponentProps<any>>(component: React.ComponentType<P>): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>>>;
