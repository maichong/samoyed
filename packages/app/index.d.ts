import * as React from 'react';
import * as H from 'history';
import { Layout } from '@samoyed/types';
import { Store } from 'redux';

type ComponentClass<T = any> = React.ComponentClass<T> | React.FunctionComponent<T>;

export interface Defaults {
  switchAnimationDuration: number;
  animationDuration: number;
  listLimit: number;
}

export interface Environments {
  ssr?: boolean;
  mac?: boolean;
  windows?: boolean;
  linux?: boolean;
  android?: boolean;
  ios?: boolean;
  iphone?: boolean;
  ipad?: boolean;
  phone?: boolean;
  desktop?: boolean;
  tablet?: boolean;
  webkit?: boolean;
  gecko?: boolean;
  chrome?: boolean;
  firefox?: boolean;
  safari?: boolean;
  edge?: boolean;
  ie?: boolean;
  ie8?: boolean;
  ie9?: boolean;
  ie10?: boolean;
  ie11?: boolean;
  landscape?: boolean;
  portrait?: boolean;
  touch?: boolean;
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
}

export interface InitOptions {
  userAgent?: string;
  touch?: boolean;
}

export interface Components {
  [name: string]: ComponentClass;
}

export interface Wrappers {
  [name: string]: ComponentClass[];
}

export interface Actions {
}

export class App {
  options: InitOptions;
  defaults: Defaults;
  components: Components;
  wrappers: Wrappers;
  is: Environments;
  inited: boolean;
  history: H.History;
  store: Store;
  actions: Actions;
  _wrapperHooks: string[];

  init(options?: InitOptions): void;
  generateBodyClassNames(): string[];
  on(event: 'layout-change', callback: Function): void;
  removeEventListener(event: 'layout-change', callback: Function): void;
  addAction(name: string, actionCreator: Function): void;
}

declare const app: App;

export default app;
