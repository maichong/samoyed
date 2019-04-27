import * as React from 'react';
import { Layout, AnimationType, Animation, Placement } from '@samoyed/types';

declare module '@samoyed/app' {
  export interface Components {
    Box?: React.ComponentClass<BoxProps>;
  }
}

export interface BoxProps extends React.HTMLAttributes<Element> {
  /**
   * 子节点
   */
  childen?: React.ReactNode;
  /**
   * Box外层样式类
   */
  className?: string;
  /**
   * Box内层样式类
   */
  bodyClassName?: string;
  /**
   * 外层div ref
   */
  elRef?: (instance: any | null) => void;
  /**
   * 内层div ref
   */
  bodyRef?: (instance: any | null) => void;
  /**
   * 停靠组件
   */
  docked?: React.ReactNode;
  /**
   * 停靠位置，默认为 top
   */
  dockedPlacement?: Placement;
  /**
   * Box 滚动
   */
  scrollable?: 'both' | 'horizontal' | 'vertical' | false;
  /**
   * 是否自动伸缩，如果为true，则自动添加 s-flex 样式类
   */
  flex?: boolean;
  /**
   * 布局方式
   */
  layout?: Layout;
  /**
   * Card layout 当前激活项
   */
  activeItem?: number;
  /**
   * Card layout 子组件切换动画
   */
  animation?: AnimationType | Animation;
  /**
   * 当前Box是否激活状态，如果为true，则自动添加 s-active 样式类，用于过度动画
   */
  active?: boolean;
  /**
   * 是否为前一个激活Box，如果为true，则自动添加 s-previous 样式类，用于过度动画
   */
  previous?: boolean;
  /**
   * 是否为上一个激活Box，如果为true，则自动添加 s-last 样式类，用于过度动画
   */
  last?: boolean;
  /**
   * Box包裹层
   */
  wrapper?: string;
  /**
   * Box包裹层组件Props
   */
  wrapperProps?: any;
  /**
   * 监听div宽高变化
   */
  onResize?: (rect: ClientRect) => any;
}

export default class Box extends React.Component<BoxProps> {
}
