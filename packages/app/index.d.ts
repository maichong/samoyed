import * as React from 'react';
import { Layout } from '@samoyed/types';

export class App {
  views: {
    [name: string]: React.ComponentClass<any>;
  };

  init(): void;
}

declare const app: App;

export default app;
