import * as React from 'react';
import { Layout } from '@samoyed/types';

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

export class App {
  options: InitOptions;
  defaults: Defaults;
  // components: Components;
  wrappers: Wrappers;
  is: Environments;
  inited: boolean;
  _wrapperHooks: string[];

  init(options?: InitOptions): void;
  generateBodyClassNames(): string[];
}

declare const app: App;

export default app;
