import * as React from 'react';
import { Layout } from '@samoyed/types';

export interface Defaults {
  switchAnimationDuration: number;
  animationDuration: number;
}

export interface Environments {
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
}

export class App {
  defaults: Defaults;
  views: {
    [name: string]: React.ComponentClass<any>;
  };
  is: Environments;

  init(): void;
}

declare const app: App;

export default app;
