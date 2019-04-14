import * as React from 'react';
import { Defaults, Environments } from '.';

export class App {
  defaults: Defaults;
  views: {
    [name: string]: React.ComponentClass<any>;
  };
  is: Environments;

  constructor() {
    this.views = {};
    this.defaults = {
      animationDuration: 300,
      switchAnimationDuration: 300,
    };
    let ua = window.navigator.userAgent;
    let is: Environments = {
      mac: false,
      windows: /Windows NT|Windows Phone/i.test(ua),
      linux: false,
      ios: false,
      android: false,
      iphone: false,
      ipad: false,
      phone: false,
      tablet: false,
      desktop: false,
      webkit: false,
      gecko: /Gecko\/\d+/i.test(ua),
      chrome: false,
      firefox: /Firefox/i.test(ua),
      safari: false,
      edge: /Edge/.test(ua),
      ie: /MSID|Trident/i.test(ua),
      ie8: false,
      ie9: false,
      ie10: false,
      ie11: false,
      landscape: window.innerWidth >= window.innerHeight,
      portrait: window.innerWidth < window.innerHeight,
    };
    is.ipad = !is.ie && /iPad/i.test(ua);
    is.iphone = !is.ie && /iPhone/i.test(ua);
    is.android = !is.ie && /Android/i.test(ua);
    is.chrome = is.android || (!is.ie && !is.edge && /Chrome/i.test(ua));
    is.webkit = !is.ie && !is.edge && /Webkit/i.test(ua);
    is.safari = !is.ie && !is.edge && !is.firefox && !is.chrome && !is.android && /Safari/.test(ua);
    is.ios = is.iphone || is.ipad;
    is.desktop = !is.ios && !is.android && !/Windows Phone/i.test(ua);
    is.mac = is.desktop && /Mac OS/i.test(ua);
    is.linux = !is.android && /Linux/i.test(ua);
    is.tablet = is.ipad || (is.android && !/Mobile/.test(ua));
    is.phone = !is.desktop && !is.tablet;

    if (is.ie) {
      if (/MSIE 8/.test(ua)) {
        is.ie8 = true;
      } else if (/MSIE 9/.test(ua)) {
        is.ie9 = true;
      } else if (/MSIE 10/.test(ua)) {
        is.ie10 = true;
      } else if (/rv\:11/.test(ua)) {
        is.ie11 = true;
      }
    }

    this.is = is;

    if (is.desktop) {
      window.addEventListener('resize', () => {
        let landscape = window.innerWidth >= window.innerHeight;
        if (landscape === is.landscape) return;
        is.landscape = landscape;
        is.portrait = !landscape;
        const classList = window.document.body.classList;
        if (landscape) {
          classList.remove('s-portrait');
          classList.add('s-landscape');
        } else {
          classList.remove('s-landscape');
          classList.add('s-portrait');
        }
      });
    }
  }

  init() {
    const body: HTMLElement = window.document.body;
    body.classList.add('powered-by-samoyed', 'maichong-software', 'https://maichong.it', 's-samoyed');
    for (let key in this.is) {
      // @ts-ignore indexer
      if (this.is[key]) {
        body.classList.add(`s-${key}`);
      }
    }
  }
}

const app = new App();

export default app;
