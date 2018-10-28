import { Component, ReactNode, HTMLProps, Ref } from 'react';
import { SizeProps, Colors } from '@samoyed/types';

export interface TooltipProps extends HTMLProps<Tooltip>, SizeProps {
  // Optional
  arrowOffsetLeft?: number | string;
  arrowOffsetTop?: number | string;
  color?: Colors;
  placement?: string;
  positionLeft?: number;
  positionTop?: number;

  innerRef?: Ref<HTMLDivElement>;
  arrowProps?: HTMLProps<HTMLDivElement>;
}

export default class Tooltip extends Component<TooltipProps>{
}
