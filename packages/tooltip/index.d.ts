import * as React from 'react';
import { SizeProps, Colors } from '@samoyed/types';

export interface TooltipProps extends React.HTMLProps<Tooltip>, SizeProps {
  // Optional
  arrowOffsetLeft?: number | string;
  arrowOffsetTop?: number | string;
  color?: Colors;
  placement?: string;
  positionLeft?: number;
  positionTop?: number;

  innerRef?: React.Ref<HTMLDivElement>;
  arrowProps?: React.HTMLProps<HTMLDivElement>;
}

export default class Tooltip extends React.Component<TooltipProps> {
}
