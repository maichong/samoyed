import * as React from 'react';
import OverlayTrigger from '@samoyed/overlay-trigger';
import Tooltip from '@samoyed/tooltip';
import * as random from 'string-random';
import { TooltipWrapperProps } from '..';

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
