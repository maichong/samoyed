import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import CardLayout from '@samoyed/card-layout';
import { BoxProps } from '.';

export default function Box(props: BoxProps) {
  const {
    children, className, bodyClassName, elRef, bodyRef, flex, scrollable, layout, activeItem, animation,
    previous, last, active, wrapper, wrapperProps, ...others
  } = props;

  let layoutProps: any = {
    ref: bodyRef
  };

  let LayoutComponent: React.ComponentClass<any> | string = 'div';
  let layoutClassName = `s-layout-${layout || 'auto'}`;
  if (layout === 'card') {
    LayoutComponent = CardLayout;
    layoutProps.activeItem = activeItem;
    layoutProps.animation = animation;
    // if (!LayoutComponent) {
    //   throw new Error('@samoyed/card-layout must be required!');
    // }
  }

  layoutProps.className = classnames(
    's-box-body',
    bodyClassName,
    { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' },
    { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' },
  );

  let el = (
    <div
      ref={elRef}
      className={classnames(
        's-component',
        's-box',
        className,
        layoutClassName,
        {
          's-flex': !!flex,
          's-previous': previous,
          's-last': last,
          's-active': active,
        }
      )}
      {...others}
    >
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

// app.components.Box = Box;
