import * as React from 'react';
import { Layout, Animation, AnimationType } from '@samoyed/types';

declare module '@samoyed/app' {
  export interface Components {
    CardLayout?: React.ComponentClass<CardLayoutProps>;
  }
}

export interface CardLayoutProps extends React.HTMLAttributes<Element> {
  /**
   * 样式类
   */
  className?: string;
  /**
   * div ref
   */
  elRef?: (instance: any | null) => void;
  /**
   * 子组件列表
   */
  childen?: React.ReactNode[];
  /**
   * 当前激活的子组件
   */
  activeItem?: number;
  /**
   * 子组件切换动画
   */
  animation?: AnimationType | Animation;
}

export default class CardLayout extends React.Component<CardLayoutProps> {
}
