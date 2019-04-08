import * as React from 'react';
import * as classnames from 'classnames';
import { BoxProps } from '.';

export default class Box extends React.Component<BoxProps> {
  render() {
    const {
      children, className, innerClassName, boxRef, innerRef
    } = this.props;
    return (
      <div className={classnames('s-box', className)} ref={boxRef}>
        <div className={classnames('s-box-inner', innerClassName)} ref={innerRef}>{children}</div>
      </div>
    );
  }
}
