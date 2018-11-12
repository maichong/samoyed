import * as React from 'react';
import { OverlayTriggerOptions } from '@samoyed/overlay-tigger';

export interface TooltipWrapperProps extends OverlayTriggerOptions {
  children: React.ReactNode;
  tooltip: React.ReactNode
}

export default class TooltipWrapper extends React.Component<TooltipWrapperProps>{
}
