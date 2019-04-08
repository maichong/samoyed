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
            { 's-scrollable-x': scrollable === 'both' || scrollable === 'x' },
            { 's-scrollable-y': scrollable === 'both' || scrollable === 'y' },
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}
