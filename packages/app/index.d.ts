import * as React from 'react';
import { Layout } from '@samoyed/types';
import { Store } from 'redux';

export interface Defaults {
  switchAnimationDuration: number;
  animationDuration: number;
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
  [name: string]: React.ComponentClass<any> | React.FunctionComponent<any>;
}

export interface Wrappers {
  [name: string]: React.ComponentClass<any>[];
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
