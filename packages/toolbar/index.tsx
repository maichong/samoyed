import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import { ToolbarProps } from '.';

export default function Toolbar(props: ToolbarProps) {
  const {
    children, className, bodyClassName, ...others
  } = props;
  return (
    <Box
      className={classnames('s-toolbar', className)}
      bodyClassName={classnames('s-toolbar-body', bodyClassName)}
      layout="horizontal"
      {...others}
    >
      {children}
    </Box>
  );
}
