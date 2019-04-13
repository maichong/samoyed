import * as React from 'react';
import { Layout } from '@samoyed/types';

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
  elRef?: React.Ref<any>;
  /**
   * 内层div ref
   */
  innerRef?: React.Ref<any>;
  /**
   * 布局方式
   */
  layout?: Layout;
  childen?: React.ReactNode | React.ReactNode[];
  scrollable?: 'both' | 'horizontal' | 'vertical' | false;
  flex?: boolean;
  previous?: boolean;
  last?: boolean;
  active?: boolean;
}

export default class Box extends React.Component<BoxProps> {
}
