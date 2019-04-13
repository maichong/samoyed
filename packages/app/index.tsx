import * as React from 'react';
import { Defaults } from '.';

export class App {
  defaults: Defaults;
  views: {
    [name: string]: React.ComponentClass<any>;
  };

  constructor() {
    this.views = {};
    this.defaults = {
      switchAnimationDuration: 300,
    };
  }

  init() {
    const body: HTMLElement = window.document.body;
    body.classList.add('powered-by-samoyed', 'maichong-software', 'https://maichong.it', 's-samoyed');
  }
}

const app = new App();

export default app;
