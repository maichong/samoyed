import * as React from 'react';
import OverlayTriggerType from 'react-bootstrap/OverlayTrigger';
import TooltipType from 'react-bootstrap/Tooltip';
import * as random from 'string-random';
import { TooltipWrapperProps } from '.';

// @ts-ignore react-bootstrap lib 目录下的导出与Types声明不符合
const Tooltip: typeof TooltipType = require('react-bootstrap/Tooltip');

// @ts-ignore react-bootstrap lib 目录下的导出与Types声明不符合
const OverlayTrigger: typeof OverlayTriggerType = require('react-bootstrap/OverlayTrigger');

export default class TooltipWrapper extends React.Component<TooltipWrapperProps> {
  static defaultProps = {
    placement: 'top'
  };

  id: string;

  constructor(props: TooltipWrapperProps) {
    super(props);
    this.id = random();
  }

  render() {
    const {
      children, tooltip, ...others
    } = this.props;
    return (
      <OverlayTrigger
        overlay={<Tooltip id={this.id}>{tooltip}</Tooltip>}
        {...others}
      >
        {children}
      </OverlayTrigger>
    );
  }
}
