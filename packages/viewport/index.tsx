import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import { ViewportProps } from '.';

export default class Viewport extends React.Component<ViewportProps> {
  render() {
    const {
      children, className, innerClassName, ...others
    } = this.props;
    return (
      <Box
        className={classnames('s-viewport', className)}
        innerClassName={classnames('s-viewport-inner', innerClassName)}
        {...others}
      >
        {children}
      </Box>
    );
  }
}
