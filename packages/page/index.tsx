import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import { PageProps } from '.';

export default function Page(props: PageProps) {
  const {
    children, className, bodyClassName, ...others
  } = props;
  return (
    <Box
      className={classnames('s-page', className)}
      bodyClassName={classnames('s-page-body', bodyClassName)}
      layout="vertical"
      {...others}
    >
      {children}
    </Box>
  );
}
