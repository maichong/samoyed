import * as React from 'react';
import { Layout, AnimationType, Animation } from '@samoyed/types';

export interface BoxProps extends React.HTMLAttributes<Element> {
  /**
   * Box外层样式类
   */
  className?: string;
  /**
   * Box内层样式类
   */
  innerClassName?: string;
  /**
   * 外层div ref
   */
  elRef?: (instance: any | null) => void;
  /**
   * 内层div ref
   */
  innerRef?: (instance: any | null) => void;
  /**
   * 布局方式
   */
  layout?: Layout;
  /**
   * Card layout 当前激活项
   */
  activeItem?: number;
  /**
   * 子组件切换动画
   */
  animation?: AnimationType | Animation;
  childen?: React.ReactNode | React.ReactNode[];
  scrollable?: 'both' | 'horizontal' | 'vertical' | false;
  flex?: boolean;
  previous?: boolean;
  last?: boolean;
  active?: boolean;
}

export default class Box extends React.Component<BoxProps> {
}
