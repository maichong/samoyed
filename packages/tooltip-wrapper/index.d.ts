import { Component, ReactNode } from 'react';
import { OverlayTriggerProps } from '@samoyed/overlay-tigger';

export interface TooltipWrapperProps extends OverlayTriggerProps {
  children: ReactNode;
  tooltip: ReactNode;
}

export default class TooltipWrapper extends Component<TooltipWrapperProps>{
}
