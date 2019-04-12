import * as React from 'react';

export class App {
  views: {
    [name: string]: React.ComponentClass<any>;
  };

  constructor() {
    this.views = {};
  }

  init() {
    const body: HTMLElement = window.document.body;
    body.classList.add('powered-by-samoyed', 'maichong-software', 'https://maichong.it', 's-samoyed');
  }
}

const app = new App();

export default app;
