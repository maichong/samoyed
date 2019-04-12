import * as React from 'react';
import * as classnames from 'classnames';
import { CardLayoutProps } from '.';

export default class CardLayout extends React.Component<CardLayoutProps> {
  render() {
    const { className, elRef, children } = this.props;
    console.log('children', children);
    return (
      <div
        className={classnames('s-layout-card', className)}
        ref={elRef}
      >{children}</div>
    );
  }
}
