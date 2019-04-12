import * as React from 'react';
import * as classnames from 'classnames';
import { BoxProps } from '.';

export default class Box extends React.Component<BoxProps> {
  render() {
    const {
      children, className, innerClassName, boxRef, innerRef, layout, flex, scrollable, ...others
    } = this.props;
    return (
      <div
        ref={boxRef}
        className={classnames(
          's-box',
          className,
          { 's-flex': !!flex }
        )}
        {...others}
      >
        <div
          ref={innerRef}
          className={classnames(
            's-box-inner',
            innerClassName,
            `s-layout-${layout || 'vbox'}`,
            { 's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal' },
            { 's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical' },
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}
