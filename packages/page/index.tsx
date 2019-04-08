import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import { PageProps } from '.';

export default class Page extends React.Component<PageProps> {
  render() {
    const {
      children, className, innerClassName, ...others
    } = this.props;
    return (
      <Box
        className={classnames('s-page', className)}
        innerClassName={classnames('s-page-inner', innerClassName)}
        {...others}
      >
        {children}
      </Box>
    );
  }
}
