import * as React from 'react';

export interface OverlayTriggerProps {
  // Required
  overlay: any; // TODO: Add more specific type

  // Optional
  animation?: any; // TODO: Add more specific type
  container?: any; // TODO: Add more specific type
  containerPadding?: number;
  defaultOverlayShown?: boolean;
  delay?: number;
  delayHide?: number;
  delayShow?: number;
  onEnter?: Function;
  onEntered?: Function;
  onEntering?: Function;
  onExit?: Function;
  onExited?: Function;
  onExiting?: Function;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  rootClose?: boolean;
  trigger?: string | string[];
}

export default class OverlayTrgger extends React.Component<OverlayTriggerProps>{
}
