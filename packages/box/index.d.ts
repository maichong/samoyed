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
  boxRef?: React.Ref<any>;
  /**
   * 内层div ref
   */
  innerRef?: React.Ref<any>;
  /**
   * 布局方式
   */
  layout?: Layout;
  childen?: React.ReactNode | React.ReactNode[];
  scrollable?: 'both' | 'x' | 'y' | false;
  flex?: boolean;
}

export default class Box extends React.Component<BoxProps> {
}
