import * as React from 'react';
import OverlayTriggerType from 'react-bootstrap/lib/OverlayTrigger';
import { PropsOf } from 'react-bootstrap/lib/helpers';

type ComponentOrElement = React.ReactInstance | Node;
export type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

type TriggerType = 'hover' | 'click' | 'focus';

export interface TooltipWrapperProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;

  // OverlayTriggerProps
  trigger?: TriggerType | TriggerType[];
  delay?: number | { show: number; hide: number };
  defaultShow?: boolean;

  // Overlay
  container?: ComponentOrElement | ((props: object) => ComponentOrElement);
  popperConfig?: object;
  rootClose?: boolean;
  rootCloseEvent?: 'click' | 'mousedown';
  transition?: boolean | React.ReactType;
  placement?: Placement;
}

export default class TooltipWrapper extends React.Component<TooltipWrapperProps> {
}
