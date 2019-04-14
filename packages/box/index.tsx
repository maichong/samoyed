import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { BoxProps } from '.';

export default class Box extends React.Component<BoxProps> {
  render() {
    const {
      children, className, innerClassName, elRef, innerRef, layout, activeItem, animation,
      flex, scrollable, previous, last, active, ...others
    } = this.props;

    let layoutProps: any = {
      ref: innerRef
    };

    let LayoutComponent: React.ComponentClass<any> | string = 'div';
    let layoutClassName = `s-layout-${layout || 'vbox'}`;
    if (layout === 'card') {
      LayoutComponent = app.views.CardLayout;
      layoutClassName = '';
      layoutProps.activeItem = activeItem;
      layoutProps.animation = animation;
      if (!LayoutComponent) {
        throw new Error('@samoyed/card-layout must be required!');
      }
    }

    layoutProps.className = classnames(
      's-box-inner',
      innerClassName,
      layoutClassName,
      { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' },
      { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' },
    );

    return (
      <div
        ref={elRef}
        className={classnames(
          's-box',
          className,
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
  }
}
