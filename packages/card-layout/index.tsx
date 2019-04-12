import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { CardLayoutProps } from '.';

class CardLayout extends React.Component<CardLayoutProps> {
  render() {
    const { className, elRef, children, active } = this.props;
    let elements = children as React.ReactNode[];
    if (!Array.isArray(elements)) {
      console.warn('Card layout children must be node array!');
      elements = elements ? [elements] : [];
    }
    let actived = elements[active || 0] || elements[0];
    return (
      <div
        className={classnames('s-layout-card', className)}
        ref={elRef}
      >{actived}</div>
    );
  }
}

app.views.CardLayout = CardLayout;

export default CardLayout;
