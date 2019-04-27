import * as React from 'react';
import * as classnames from 'classnames';
import ResizeSensorType from 'css-element-queries/src/ResizeSensor';
import app from '@samoyed/app';
import { BoxProps } from '.';

// @ts-ignore
const ResizeSensor: typeof ResizeSensorType = require('css-element-queries/src/ResizeSensor');
// @ts-ignore
const ResizeObserver = window.ResizeObserver;

export default class Box extends React.Component<BoxProps> {
  ref: HTMLElement;
  observer: any;
  sensor: ResizeSensorType;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.disconnect();
    this.ref = null;
  }

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

  handleResize = (entries?: any[] | { width: number; height: number; }) => {
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

  render() {
    const {
      children, className, bodyClassName, elRef, bodyRef, flex, scrollable, layout, activeItem, animation,
      previous, last, active, wrapper, wrapperProps, onResize, docked, dockedPlacement, ...others
    } = this.props;

    let layoutProps: any = {
      ref: bodyRef
    };

    let LayoutComponent: React.ComponentClass<any> | string = 'div';
    let layoutClassName = `s-layout-${layout || 'auto'}`;
    if (layout === 'card') {
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
      { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' },
      { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' },
    );

    let dockedClassName = '';
    if (docked) {
      dockedClassName = `s-docked-${dockedPlacement || 'top'}`;
    }

    let el = (
      <div
        ref={this.handleRef}
        className={classnames(
          's-component',
          's-box',
          className,
          dockedClassName,
          {
            's-flex': !!flex,
            's-previous': previous,
            's-last': last,
            's-active': active,
          }
        )}
        {...others}
      >
        {docked}
        <LayoutComponent {...layoutProps}>
          {children}
        </LayoutComponent>
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
