import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import { ViewportProps } from '.';

export default function Viewport(props: ViewportProps) {
  const {
    children, className, bodyClassName, ...others
  } = props;
  return (
    <Box
      className={classnames('s-viewport', className)}
      bodyClassName={classnames('s-viewport-body', bodyClassName)}
      {...others}
    >
      {children}
    </Box>
  );
}
