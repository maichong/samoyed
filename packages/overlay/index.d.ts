import * as React from 'react';

// export type Placement = 'auto-start' | 'auto' | 'auto-end'
//   | 'top-start' | 'top' | 'top-end'
//   | 'right-start' | 'right' | 'right-end'
//   | 'bottom-start' | 'bottom' | 'bottom-end'
//   | 'left-start' | 'left' | 'left-end';

export interface OverlayProps {
  // Optional
  animation?: any; // TODO: Add more specific type
  container?: any; // TODO: Add more specific type
  containerPadding?: number; // TODO: Add more specific type
  onHide?: () => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  rootClose?: boolean;
  show?: boolean;
  target?: React.ReactInstance | (() => React.ReactInstance);
  shouldUpdatePosition?: boolean;
  arrowProps?: any;
  style?: any;
}

export default class Overlay extends React.Component<OverlayProps> {
}
