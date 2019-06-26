import * as _ from 'lodash';
import * as React from 'react';
import * as classnames from 'classnames';
import Box from '@samoyed/box';
import Toolbar from '@samoyed/toolbar';
import { PanelProps } from '.';

export default function Panel(props: PanelProps) {
  let {
    icon, title, titleAlign, tools, header, headerPlacement, color, border,
    children, className, bodyClassName, bodyStyle, bodyPadding, ...others
  } = props;

  if (!header && (icon || title || tools)) {
    header = <Toolbar color={color} icon={icon} title={title} tools={tools} titleAlign={titleAlign} placement={headerPlacement || 'top'} />;
  }

  let colorCls = color ? `s-panel-${color}` : '';
  if (bodyPadding !== false && bodyPadding !== 0) {
    bodyStyle = bodyStyle ? Object.assign({}, bodyStyle) : {};
    // @ts-ignore
    bodyStyle.padding = bodyPadding || '0.5rem';
  }

  return (
    <Box
      className={classnames('s-panel', colorCls, className, { 's-panel-border': border })}
      bodyClassName={classnames('s-panel-body', bodyClassName)}
      {...others}
      bodyStyle={bodyStyle}
      dock={header}
      dockPlacement={headerPlacement}
    >
      {children}
    </Box>
  );
}
