import { Store } from 'redux';
import { Defaults, Environments, InitOptions, Components, Wrappers, Actions } from '.';

export class App {
  store: Store;
  is: Environments;
  options: InitOptions;
  defaults: Defaults;
  actions: Actions;
  components: Components;
  wrappers: Wrappers;
  _wrapperHooks: string[];
  _listeners: Function[];

  constructor() {
    this.actions = {};
    this.components = {};
    this.wrappers = {};
    this.defaults = {
      animationDuration: 300,
      switchAnimationDuration: 300,
      listLimit: 10
    };
    this.is = {
      ssr: typeof window === 'undefined'
    };
    this._wrapperHooks = [];
    this._listeners = [];
  }

  get inited() {
    return !!this.options;
  }

  init(options?: InitOptions) {
    options = options || {};
    this.options = options;
    const ssr = typeof window === 'undefined';

    const ua = options.userAgent || (ssr ? '' : window.navigator.userAgent);
    const width = ssr ? 1 : window.innerWidth;

    let is: Environments = {
      ssr,
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
      landscape: ssr ? true : (window.innerWidth >= window.innerHeight),
      portrait: ssr ? false : (window.innerWidth < window.innerHeight),
      touch: false,
      xs: width < 576,
      sm: width >= 576 && width < 768,
      md: width >= 768 && width < 992,
      lg: width >= 992 && width < 1200,
      xl: width >= 1200
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
    is.touch = options.touch || is.phone || is.tablet;

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

    if (ssr) return;

    window.document.body.classList.add(...this.generateBodyClassNames());

    if (is.desktop) {
      this._watchSize();
    }
  }

  _watchSize() {
    const toggleSize = (name: string, min: number, max: number) => {
      let bool = window.innerWidth >= min && window.innerWidth < max;
      // @ts-ignore indexer
      if (this.is[name] === bool) return false; // 没变化
      // @ts-ignore indexer
      this.is[name] = bool;
      let className = `s-${name}`;
      let classList = window.document.body.classList;
      if (bool) {
        classList.add(className);
      } else {
        classList.remove(className);
      }
      return true;
    };
    let w = window.innerWidth;
    window.addEventListener('resize', () => {
      let changed = false;
      if (w !== window.innerWidth) {
        changed = toggleSize('xs', 0, 576);
        changed = toggleSize('sm', 576, 768) || changed;
        changed = toggleSize('md', 768, 992) || changed;
        changed = toggleSize('lg', 992, 1200) || changed;
        changed = toggleSize('xl', 1200, Infinity) || changed;
      }
      w = window.innerWidth;
      let landscape = window.innerWidth >= window.innerHeight;
      if (landscape !== this.is.landscape) {
        this.is.landscape = landscape;
        this.is.portrait = !landscape;
        const classList = window.document.body.classList;
        if (landscape) {
          classList.remove('s-portrait');
          classList.add('s-landscape');
        } else {
          classList.remove('s-landscape');
          classList.add('s-portrait');
        }
      }
      if (changed) {
        this._listeners.forEach((fn) => fn());
      }
    });
  }

  generateBodyClassNames(): string[] {
    let classNames = ['powered-by-samoyed', 'maichong-software', 'https://maichong.it', 's-samoyed'];

    for (let key in this.is) {
      // @ts-ignore indexer
      if (this.is[key]) {
        classNames.push(`s-${key}`);
      }
    }

    return classNames;
  }

  on(event: 'layout-change', callback: Function) {
    if (event !== 'layout-change') throw new Error('Unknown event name!');
    this._listeners.push(callback);
  }

  removeEventListener(event: 'layout-change', callback: Function) {
    if (event !== 'layout-change') throw new Error('Unknown event name!');
    this._listeners = this._listeners.filter((fn) => fn !== callback);
  }

  addAction(name: string, actionCreator: Function): void {
    let me = this;
    // @ts-ignore indexer
    me.actions[name] = function () {
      me.store.dispatch(actionCreator.apply(me, arguments));
    };
  }
}

const app = new App();

export default app;
