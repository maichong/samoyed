import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import random from 'string-random';
import { TooltipWrapperProps } from '..';

export default class TooltipWrapper extends Component<TooltipWrapperProps> {
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
      children, tooltip, placement, ...others
    } = this.props;
    return (
      <OverlayTrigger
        placement={placement}
        overlay={<Tooltip id={this.id}>{tooltip}</Tooltip>}
        {...others}
      >
        {children}
      </OverlayTrigger>
    );
  }
}
