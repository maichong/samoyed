import * as React from 'react';
import { OverlayTriggerProps } from '@samoyed/overlay-tigger';

export interface TooltipWrapperProps extends OverlayTriggerProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
}

export default class TooltipWrapper extends React.Component<TooltipWrapperProps>{
}
