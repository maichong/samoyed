import * as React from 'react';
import { Layout } from '@samoyed/types';

export interface Defaults {
  switchAnimationDuration: number;
}

export class App {
  defaults: Defaults;
  views: {
    [name: string]: React.ComponentClass<any>;
  };

  init(): void;
}

declare const app: App;

export default app;
