import * as _ from 'lodash';
import * as React from 'react';
import * as classnames from 'classnames';
import TweezerType from 'tweezer.js';
import ResizeSensorType from 'css-element-queries/src/ResizeSensor';
import app from '@samoyed/app';
import { BoxProps, ScrollData, PullRefreshStatus, PullRefreshTexts } from '.';

// @ts-ignore tweezer.js库类型定义bug
const Tweezer: typeof TweezerType = require('tweezer.js');

// @ts-ignore
const ResizeSensor: typeof ResizeSensorType = require('css-element-queries/src/ResizeSensor');
// @ts-ignore
const ResizeObserver = window.ResizeObserver;

function getPullRefreshTexts(pullRefreshTexts: PullRefreshTexts, status: PullRefreshStatus): React.ReactNode {
  let text = pullRefreshTexts[status];
  if (!text && status === 'loaded') {
    text = pullRefreshTexts.loading;
  }
  return text;
}

interface Position {
  x: number;
  y: number;
}

interface State {
  pullStatus: PullRefreshStatus | null;
}

interface IndicatorStyle {
  opacity?: string;
  size?: number;
  offset?: number;
}

let boxCount = 0;

export default class Box extends React.Component<BoxProps, State> {
  id: string;
  ref: HTMLElement;
  bodyRef: HTMLElement;
  pullRef: HTMLElement;
  xIndicator: HTMLElement;
  yIndicator: HTMLElement;
  observer: any;
  sensor: ResizeSensorType;
  lastScrollTop: number;
  reachedBottom: boolean;
  dragging: boolean;
  startPos: Position;
  lastPos: Position;
  flickStartPos: Position;
  flickStartTime: number;
  offset: Position;
  tweezer: TweezerType;
  direction: {
    x: boolean;
    y: boolean;
  };
  axisEnabled: {
    x: boolean;
    y: boolean;
  };
  pullRefreshHeight: number;
  xIndicatorStyle: IndicatorStyle;
  yIndicatorStyle: IndicatorStyle;

  constructor(props: BoxProps) {
    super(props);
    this.state = { pullStatus: null };
    this.offset = { x: 0, y: 0 };
    this.lastScrollTop = 0;
    this.dragging = false;
    this.pullRefreshHeight = 50;
    this.xIndicatorStyle = {};
    this.yIndicatorStyle = {};
    boxCount += 1;
    this.id = `box-${boxCount}`;
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.disconnect();
    this.ref = null;
    this.bodyRef = null;
    this.pullRef = null;
    this.xIndicator = null;
    this.yIndicator = null;
    if (this.tweezer) {
      this.tweezer.stop();
      this.tweezer = null;
    }
  }

  updateStyles() {
    let { offset, bodyRef, pullRef } = this;
    if (!bodyRef) return;
    let yOffset = offset.y;
    if (yOffset > 0) {
      yOffset /= 2;
    }
    bodyRef.style.transform = `translate3d(${offset.x}px, ${yOffset}px,0)`;
    if (yOffset > 0 && pullRef) {
      let y = yOffset - pullRef.clientHeight;
      if (y > 0) {
        y = y / 2;
      }
      let opacity = Math.abs(-pullRef.clientHeight - y) / pullRef.clientHeight;
      pullRef.style.transform = `translate3d(0px, ${y}px,0)`;
      pullRef.style.opacity = Math.min(1, opacity).toFixed(2);
    }
    if (this.yIndicator && this.axisEnabled.y && this.yIndicatorStyle) {
      this.yIndicator.style.opacity = this.yIndicatorStyle.opacity;
      let size = `${this.yIndicatorStyle.size}px`;
      if (size !== this.yIndicator.style.height) {
        this.yIndicator.style.height = size;
      }
      let y = this.yIndicatorStyle.offset;
      this.yIndicator.style.transform = `translate3d(0px, ${y}px,0)`;
    }
  }

  hideIndicator = () => {
    if (this.xIndicatorStyle) {
      this.xIndicatorStyle.opacity = '0';
    }
    if (this.yIndicatorStyle) {
      this.yIndicatorStyle.opacity = '0';
    }
    this.updateStyles();
  };

  init() {
    if (this.observer || this.sensor || !this.ref) return;
    if (!this.props.onResize) {
      this.disconnect();
      return;
    }

    if (typeof ResizeObserver === 'function') {
      // Chrome 64
      this.observer = new ResizeObserver(this.handleResize);
      this.observer.observe(this.ref);
      return;
    }

    // others
    this.sensor = new ResizeSensor(this.ref, this.handleResize);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.sensor) {
      this.sensor.detach();
      this.sensor = null;
    }
  }

  handleResize = (entries?: any[] | { width: number; height: number }) => {
    if (!this.props.onResize) return;
    let rect;
    if (Array.isArray(entries)) {
      rect = entries[0].contentRect;
    } else if (this.ref) {
      rect = this.ref.getBoundingClientRect();
    } else {
      rect = DOMRect.fromRect(entries);
    }
    this.props.onResize(rect);
  };

  handleRef = (r: HTMLElement) => {
    const { elRef } = this.props;
    if (elRef) {
      elRef(r);
    }
    if (!this.props.onResize) {
      this.disconnect();
      return;
    }
    if ((this.observer || this.sensor) && r !== this.ref) {
      this.disconnect();
    }
    this.ref = r;
    this.init();
  };

  handleBodyRef = (r: HTMLElement) => {
    let { bodyRef } = this.props;
    if (bodyRef) {
      bodyRef(r);
    }
    this.bodyRef = r;
  };

  handlePullRef = (r: HTMLElement) => {
    this.pullRef = r;
  };

  handleScroll = (event: any) => {
    const currentTarget = event.currentTarget;
    const { scrollHeight, clientHeight, scrollTop, scrollLeft } = currentTarget;

    this._scroll({
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth: currentTarget.scrollWidth,
      clientHeight,
      clientWidth: currentTarget.clientWidth
    });
  };

  _scroll(data: ScrollData) {
    const { scrollable, onBodyScroll, onReachBottom, reachBottomBorder = 0 } = this.props;
    if (onBodyScroll) onBodyScroll(data);
    let bottom = data.scrollHeight - data.clientHeight - data.scrollTop;
    const vertical = scrollable === 'both' || scrollable === 'vertical';
    if (this.reachedBottom) {
      if (
        data.scrollTop < this.lastScrollTop // 往上滑了，标记未触底
        || bottom > reachBottomBorder // 未触底
      ) {
        // 标记未触底
        this.reachedBottom = false;
      }
    } else if (vertical && onReachBottom && data.scrollTop > this.lastScrollTop) {
      if (bottom <= reachBottomBorder) {
        this.reachedBottom = true;
        onReachBottom();
      }
    }
    this.lastScrollTop = data.scrollTop;
  }

  handleStart = (e: any) => {
    if (e.touches.length > 1 || !this.bodyRef) return;
    const { scrollable } = this.props;
    let { clientX: x, clientY: y } = e.touches[0];
    let pos = { x, y };
    this.startPos = pos;
    this.lastPos = pos;
    this.flickStartPos = pos;
    this.flickStartTime = Date.now();
    this.direction = { x: true, y: true };
    this.dragging = true;
    this.axisEnabled = {
      x: scrollable === 'horizontal' || scrollable === 'both',
      y: scrollable === 'vertical' || scrollable === 'both'
    };
    if (this.tweezer) {
      this.tweezer.stop();
      delete this.tweezer;
    }
  };

  handleMove = (e: any) => {
    if (!this.dragging) return;
    let { clientX: x, clientY: y } = e.touches[0];
    let { onPullRefresh } = this.props;
    let pos = { x, y };
    let lastPos = this.lastPos;
    let offset = this.offset;
    let direction = { x: true, y: true };

    let clientWidth = this.bodyRef.parentElement.clientWidth;
    let clientHeight = this.bodyRef.parentElement.clientHeight;
    let scrollWidth = this.bodyRef.scrollWidth;
    let scrollHeight = this.bodyRef.scrollHeight;

    if (this.axisEnabled.x) {
      let diffX = pos.x - lastPos.x;
      offset.x += diffX;
      direction.x = diffX > 0;
      if (offset.x > 0) {
        offset.x = 0;
      } else {
        let min = clientWidth - scrollWidth;
        if (min > 0) {
          offset.x = 0;
        } else if (offset.x < min) {
          offset.x = min;
        }
      }
    }

    if (this.axisEnabled.y) {
      let diffY = pos.y - lastPos.y;
      offset.y += diffY;
      direction.y = diffY > 0;

      let max = 0;
      if (onPullRefresh) {
        if (this.pullRef) {
          max = this.pullRef.clientHeight * 4;
        }
        if (max < 50) {
          max = 50;
        }
      }
      if (offset.y > max) {
        offset.y = max;
      }

      let min = clientHeight - scrollHeight;
      if (min > 0) {
        if (offset.y < 0 || !onPullRefresh) {
          offset.y = 0;
        }
      } else if (offset.y < min) {
        offset.y = min;
      }

      if (onPullRefresh && [null, 'pull', 'release'].includes(this.state.pullStatus)) {
        let pullRefreshHeight = 50;
        if (this.pullRef) {
          pullRefreshHeight = this.pullRef.clientHeight || 50;
        }
        let pullStatus: PullRefreshStatus = 'pull';
        if (offset.y > pullRefreshHeight * 2) {
          pullStatus = 'release';
        } else if (offset.y <= 0) {
          pullStatus = null;
        }
        if (pullStatus !== this.state.pullStatus) {
          this.setState({ pullStatus });
        }
      }
    }

    if (direction.x !== this.direction.x || direction.y !== this.direction.y) {
      this.flickStartPos = pos;
      this.flickStartTime = Date.now();
      this.direction = direction;
    }

    if (this.lastPos.x !== pos.x || this.lastPos.y !== pos.y) {
      this.lastPos = pos;

      if (this.axisEnabled.x) {
        let style: IndicatorStyle = {
          opacity: '0.3',
          // @ts-ignore parseInt number
          size: parseInt(clientWidth / scrollWidth * clientWidth),
        };
        if (style.size > clientWidth) {
          style.size = clientWidth;
        }
        // @ts-ignore parseInt number
        style.offset = parseInt((-offset.x) / scrollWidth * clientWidth);
        this.xIndicatorStyle = style;
      }

      if (this.axisEnabled.y) {
        let style: IndicatorStyle = {
          opacity: '0.3',
          // @ts-ignore parseInt number
          size: parseInt(clientHeight / scrollHeight * clientHeight),
        };
        if (style.size > clientHeight) {
          style.size = clientHeight;
        }
        // @ts-ignore parseInt number
        style.offset = parseInt((-offset.y) / scrollHeight * clientHeight);
        this.yIndicatorStyle = style;
      }

      this.updateStyles();

      this._scroll({
        // @ts-ignore parseInt number
        scrollTop: parseInt(-offset.y),
        // @ts-ignore parseInt number
        scrollLeft: parseInt(-offset.x),
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth
      });
    }
  };

  handleEnd = (e: any) => {
    if (!this.dragging) return;
    this.dragging = false;
    let { offset, lastPos, bodyRef, axisEnabled } = this;
    const { onPullRefresh } = this.props;
    let final = Object.assign({}, offset);

    let clientWidth = bodyRef.parentElement.clientWidth;
    let clientHeight = bodyRef.parentElement.clientHeight;
    let scrollWidth = bodyRef.scrollWidth;
    let scrollHeight = bodyRef.scrollHeight;

    const time = Date.now() - this.flickStartTime;

    if (axisEnabled.x) {
      let xDistance = lastPos.x - this.flickStartPos.x;
      let xVelocity = xDistance / time;
      if (Math.abs(xDistance) > 5 && Math.abs(xVelocity) > 0.01) {
        final.x += xVelocity * 500;
      }
      if (final.x > 0) {
        final.x = 0;
      }
      let min = clientWidth - scrollWidth;
      if (min > 0) {
        final.x = 0;
      } else if (final.x < min) {
        final.x = min;
      }
    }
    if (axisEnabled.y) {
      let yDistance = lastPos.y - this.flickStartPos.y;
      let yVelocity = yDistance / time;
      if (Math.abs(yDistance) > 5 && Math.abs(yVelocity) > 0.01) {
        final.y += yVelocity * 500;
      }

      if (onPullRefresh && this.pullRef && this.state.pullStatus === 'loading' && final.y > this.pullRef.clientHeight) {
        final.y = this.pullRef.clientHeight;
      } else if (final.y > 0) {
        final.y = 0;
      }

      let min = clientHeight - scrollHeight;
      if (min > 0) {
        final.y = 0;
      } else if (final.y < min) {
        final.y = min;
      }

      if (onPullRefresh && this.pullRef && this.state.pullStatus === 'release') {
        final.y = this.pullRef.clientHeight;
        this.setState({ pullStatus: 'loading' });
        let called = false;
        const callback = () => {
          this.hideIndicator();
          if (!this.pullRef) return;
          this.setState({ pullStatus: 'loaded' });
          if (this.tweezer) {
            this.tweezer.stop();
          }
          this.tweezer = new Tweezer({
            start: this.offset.y,
            end: 0,
            duration: 300
          });
          this.tweezer.on('tick', (value) => {
            if (value !== this.offset.y) {
              this.offset.y = value;
              this.updateStyles();
            }
          }).on('done', () => {
            if (this.tweezer && this.state.pullStatus === 'loaded') {
              this.setState({ pullStatus: null });
            }
          }).begin();
        };
        let start = Date.now();
        onPullRefresh(() => {
          if (called) return;
          called = true;
          let t = Date.now() - start;
          if (t > 500) {
            callback();
          } else {
            setTimeout(callback, 500 - t);
          }
        });
      }
    }

    if (final.x !== offset.x || final.y !== offset.y) {
      let start = { x: offset.x, y: offset.y };
      let diff = { x: final.x - start.x, y: final.y - start.y };
      let duration = 1000;
      if (final.y === 0 && start.y > 0) {
        // 下拉刷新取消
        duration = 500;
      }
      this.tweezer = new Tweezer({
        start: 0,
        end: 1000,
        duration,
        easing(t, b, c, d) {
          // easeOutQuad
          // eslint-disable-next-line no-return-assign
          return -c * (t /= d) * (t - 2) + b;
        }
      });
      this.tweezer.on('tick', (value) => {
        if (axisEnabled.x) {
          this.offset.x = start.x + value * diff.x / 1000;

          let style: IndicatorStyle = {
            opacity: '0.3',
            // @ts-ignore parseInt number
            size: parseInt(clientWidth / scrollWidth * clientWidth),
          };
          if (style.size > clientWidth) {
            style.size = clientWidth;
          }
          // @ts-ignore parseInt number
          style.offset = parseInt((-offset.x) / scrollWidth * clientWidth);
          this.xIndicatorStyle = style;
        }
        if (axisEnabled.y) {
          this.offset.y = start.y + value * diff.y / 1000;

          let style: IndicatorStyle = {
            opacity: '0.3',
            // @ts-ignore parseInt number
            size: parseInt(clientHeight / scrollHeight * clientHeight),
          };
          if (style.size > clientHeight) {
            style.size = clientHeight;
          }
          // @ts-ignore parseInt number
          style.offset = parseInt((-offset.y) / scrollHeight * clientHeight);
          this.yIndicatorStyle = style;
        }

        this.updateStyles();

        this._scroll({
          // @ts-ignore parseInt number
          scrollTop: parseInt(-this.offset.y),
          // @ts-ignore parseInt number
          scrollLeft: parseInt(-this.offset.x),
          scrollHeight,
          scrollWidth,
          clientHeight,
          clientWidth
        });

      }).on('done', this.hideIndicator).begin();
    } else {
      setTimeout(this.hideIndicator, 300);
    }
  };

  render() {
    let {
      id, children, className, bodyClassName, style, bodyStyle, elRef, bodyRef, width, height, bg,
      flex, scrollable, layout, activeItem, animation, addonAfter, addonBefore,
      last, active, wrapper, wrapperProps, onResize, dock, dockPlacement,
      nativeScroll, onPullRefresh, pullRefreshTexts,
      onBodyScroll, reachBottomBorder, onReachBottom, ...others
    } = this.props;

    let { pullStatus } = this.state;

    style = style ? Object.assign({}, style) : {};
    if (typeof height === 'string' && /^\d+$/.test(height)) {
      height = parseInt(height);
    }
    if (height || height === 0) {
      style.height = height;
    }
    if (typeof width === 'string' && /^\d+$/.test(width)) {
      width = parseInt(width);
    }
    if (width || width === 0) {
      style.width = width;
    }

    nativeScroll = typeof nativeScroll === 'boolean' ? nativeScroll : app.defaults.nativeScroll;
    if (typeof nativeScroll !== 'boolean') nativeScroll = !app.is.xs;

    let jsScroll = scrollable && !nativeScroll;
    const vertical = scrollable === 'both' || scrollable === 'vertical';

    let layoutProps: any = {
      ref: (jsScroll || bodyRef) ? this.handleBodyRef : null,
      style: bodyStyle,
      onScroll: (scrollable && onBodyScroll) || (vertical && onReachBottom) ? this.handleScroll : null,
      onTouchStart: jsScroll ? this.handleStart : null,
      onTouchMove: jsScroll ? this.handleMove : null,
      onTouchEnd: jsScroll ? this.handleEnd : null
    };

    let LayoutComponent: React.ComponentClass<any> | string = 'div';
    let layoutClassName = `s-layout-${layout || 'auto'}`;
    if (layout === 'card') {
      jsScroll = false;
      nativeScroll = true;
      LayoutComponent = app.components.CardLayout;
      if (!LayoutComponent) {
        throw new Error('@samoyed/card-layout must be required!');
      }
      layoutProps.activeItem = activeItem;
      layoutProps.animation = animation;
    }

    if (['card', 'none'].indexOf(layout) > -1) {
      layoutClassName = '';
    }

    layoutProps.className = classnames(
      's-box-body',
      bodyClassName,
      layoutClassName,
      {
        's-scroll-native': scrollable && nativeScroll,
        's-scroll-horizontal': scrollable === 'both' || scrollable === 'horizontal',
        's-scroll-vertical': scrollable === 'both' || scrollable === 'vertical'
      }
    );

    if (bg) {
      layoutProps.className += ` bg-${bg}`;
    }

    let dockClassName = '';
    if (dock) {
      dockClassName = `s-dock s-dock-${dockPlacement || 'top'}`;
    }

    let body = React.createElement(LayoutComponent, layoutProps, children);

    if (jsScroll) {
      if (onPullRefresh && pullStatus) {
        pullRefreshTexts = pullRefreshTexts || 'Pull Refresh';
        if (typeof pullRefreshTexts === 'function') {
          if (Object.getPrototypeOf(pullRefreshTexts) === React.Component) {
            // @ts-ignore
            pullRefreshTexts = React.createElement(pullRefreshTexts, { status: pullStatus });
          } else {
            pullRefreshTexts = pullRefreshTexts(pullStatus);
          }
          // @ts-ignore
        } else if (typeof pullRefreshTexts === 'object' && pullRefreshTexts.pull) {
          // @ts-ignore
          pullRefreshTexts = getPullRefreshTexts(pullRefreshTexts, pullStatus);
        }
        if (typeof pullRefreshTexts === 'string') {
          pullRefreshTexts = <div className="s-text">{pullRefreshTexts}</div>;
        }
      } else {
        pullRefreshTexts = null;
      }
      body = <div className={classnames('s-scroll-body', {
        's-scroll-horizontal': scrollable === 'both' || scrollable === 'horizontal',
        's-scroll-vertical': scrollable === 'both' || scrollable === 'vertical'
      })}>
        {onPullRefresh && <div className="s-pull-refresh" ref={this.handlePullRef}>{pullRefreshTexts}</div>}
        {body}
        <div
          ref={(r) => { this.xIndicator = r }}
          className="s-scroll-indicator s-horizontal"
        ></div>
        <div
          ref={(r) => { this.yIndicator = r }}
          className="s-scroll-indicator s-vertical"
        ></div>
      </div>;
    }

    let el = (
      <div
        id={id || this.id}
        ref={this.handleRef}
        className={classnames(
          's-component',
          's-box',
          className,
          dockClassName,
          {
            's-flex': !!flex,
            's-last': last,
            's-active': active,
          }
        )}
        style={style}
        {...others}
      >
        {addonBefore}
        {dock}
        {body}
        {addonAfter}
      </div>
    );

    if (wrapper) {
      if (app._wrapperHooks.indexOf(wrapper) === -1) {
        app._wrapperHooks.push(wrapper);
      }
      let wrappers = app.wrappers[wrapper];
      if (wrappers && wrappers.length) {
        el = wrappers.reduce(
          (c, Wrapper) => React.createElement(Wrapper, wrapperProps, c),
          el
        );
      }
    }
    return el;
  }
}


app.components.Box = Box;
